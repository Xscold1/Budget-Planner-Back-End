//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

//utils
const findUserId = require('../../utils/findUserId');
const getDateToday = require('../../utils/getDateToday');
const getDefaultBudget = require('../../utils/getDefaultBudget');

//models
const DEBT = require('../../models/debt-model')
const EXPENSES = require('../../models/expense-model')

//api
const BORROW_AND_LEND = async(reqBody , reqQuery) =>{
  try {
    const {email, budgetName} = reqQuery
    const {dueDate, name, interest, totalDebt, debtType} = reqBody

    const userId = await findUserId(email)

    const checkIfDebtExist = await DEBT.findOne({userId:userId, name:name.toLowerCase(), debtType:debtType, budgetName:budgetName})

    if(checkIfDebtExist && checkIfDebtExist.status !== 'paid' ) {
      throw (ERROR_MESSAGE.DEBT_ALEADY_EXIST)
    }
    
    const createPayload = {
      dueDate,
      totalDebt: totalDebt + ((interest / 100) * totalDebt),
      balance : totalDebt + ((interest / 100) * totalDebt),
      name:name.toLowerCase(),
      interest,
      budgetName,
      userId:userId,
      debtType: debtType
    }
    
    const createDebt = await DEBT.create(createPayload)

    return createDebt
  } catch (error) {
    throw error
  }
}

const RECEIVE_AND_PAY = async(reqBody, reqQuery) =>{
  try {

    const MONTHS = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }

    const date = new Date(getDateToday()).getDate();
    const month = new Date(getDateToday()).getMonth();
    const year = new Date(getDateToday()).getFullYear();

    const newDate = MONTHS[month] + " " + date + "," + year;

    const {email} = reqQuery

    process.env.TZ

    const userId = await findUserId(email)

    const {payments, name, debtType} = reqBody

    const findDebt = await DEBT.findOne({userId:userId, name:name.toLowerCase(), debtType:debtType})

    if(!findDebt) throw (ERROR_MESSAGE.DEBT_DO_NOT_EXIST)

    const payDebt = await DEBT.findOneAndUpdate({
        userId: userId,
        name:name.toLowerCase(),
        debtType: debtType,
        status: "Still Paying",
      },{
        $inc: { "balance": -payments.amount },
        $push: {
          payments: { amount: payments.amount, paymentDate: getDateToday() },
        },
      },
      {
        new: true,
        // Add a projection to ensure that the update operation doesn't set the balance below 0
      }
    );

    if(payDebt.debtType === "borrowed"){
      const expensesPayload = {
        amount:payments.amount,
        createdAt:getDateToday(),
        note:`payment to  ${name.toLowerCase()}`,
        category:"debt",
        expenseType:"debt",
        budgetName:getDefaultBudget(email),
        userId:userId,
      }
      await EXPENSES.create(expensesPayload)
    }
    if(payDebt.balance <= 0 ){
      const updateDebtStatus = await DEBT.findOneAndUpdate({userId:userId, name:name.toLowerCase(), debtType:debtType}, {status: "paid", name:`${name.toLowerCase()} ${newDate}`, balance:0}, {new: true})
      return updateDebtStatus
    }

    
    return payDebt
  } catch (error) {
    throw error
  }
}

const GET_PAYMENTS = async (reqQuery) =>{
  try {
    const {email, name} = reqQuery
    const userId = await findUserId(email)
  
    const getPaymetsHistory = await DEBT.aggregate([{$match:{userId:userId, name:name.toLowerCase()}} , {$project:{"payments":1, _id:0}}])

    if(!getPaymetsHistory) throw (SUCCESS_MESSAGE.FETCH_SUCCESS_NO_DATA)

    return getPaymetsHistory
  } catch (error) {
    throw error
  }
}

const GET_LEND_LISTS = async (reqQuery) =>{
  try {
    const { email, debtType } = reqQuery;
    const userId = await findUserId(email);

    // Call tz env to
    process.env.TZ;

    const dateToday = new Date();

    const getLendList = await DEBT.find({ userId: userId, debtType: debtType });

    const overdueDebts = getLendList.filter((debt) => {
        return debt.status !== "paid" && new Date(debt.dueDate) <= dateToday;
    });

    // Add interest and update dueDate for overdue debts
    overdueDebts.forEach(async (overdueDebt) => {
        const interestRate = overdueDebt.interest;
        const principalAmount = overdueDebt.totalDebt;

        // Calculate interest
        const interestAmount = principalAmount * (interestRate / 100);
        overdueDebt.totalDebt += interestAmount;

        // Update dueDate to 1 month after the current dueDate
        const newDueDate = new Date(overdueDebt.dueDate);
        newDueDate.setMonth(newDueDate.getMonth() + 1);

        // Handle the case where the month rolled over to the next year
        if (newDueDate.getMonth() !== (overdueDebt.dueDate.getMonth() + 1) % 12) {
            newDueDate.setFullYear(newDueDate.getFullYear() + 1);
        }

        overdueDebt.dueDate = newDueDate;

        await overdueDebt.save();
    });

    if (!getLendList.length) throw SUCCESS_MESSAGE.FETCH_SUCCESS_NO_DATA;

    return getLendList;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  BORROW_AND_LEND,
  RECEIVE_AND_PAY,
  GET_PAYMENTS,
  GET_LEND_LISTS,
}