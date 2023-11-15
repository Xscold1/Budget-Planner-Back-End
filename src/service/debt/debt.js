//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

//utils
const findUserId = require('../../utils/findUserId');
const getDateToday = require('../../utils/getDateToday');

//models
const DEBT = require('../../models/debt-model')
const EXPENSES = require('../../models/expense-model')

//api
const BORROW_AND_LEND = async(reqBody , reqQuery) =>{
  try {
    const {email} = reqQuery
    const {dueDate, name, interest, totalDebt, debtType} = reqBody

    const userId = await findUserId(email)

    const checkIfDebtExist = await DEBT.findOne({userId:userId, name:name, debtType:debtType})

    if(checkIfDebtExist && checkIfDebtExist.status !== 'paid' ) {
      throw (ERROR_MESSAGE.DEBT_ALEADY_EXIST)
    }
    
    const createPayload = {
      dueDate,
      totalDebt: totalDebt + ((interest / 100) * totalDebt),
      balance : totalDebt + ((interest / 100) * totalDebt),
      name,
      interest,
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

    const {email, budgetName} = reqQuery

    process.env.TZ

    const dateNow = new Date()

    const userId = await findUserId(email)

    const {payments, name, debtType} = reqBody

    const findDebt = await DEBT.findOne({userId:userId, name: name, debtType:debtType})

    if(!findDebt) throw (ERROR_MESSAGE.DEBT_DO_NOT_EXIST)

    const payDebt = await DEBT.findOneAndUpdate(
      {
        userId: userId,
        name:name,
        debtType: debtType,
        status: "Still Paying",
      },
      {
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
        note:`payment to  ${name}`,
        category:"debt",
        expenseType:"debt",
        budgetName:budgetName,
        userId:userId,
      }
      await EXPENSES.create(expensesPayload)
    }

    if(payDebt.balance <= 0 ){
      const updateDebtStatus = await DEBT.findOneAndUpdate({userId:userId, name:name, debtType:debtType}, {status: "paid", name:  `${name} ${dateNow.toDateString()} ${dateNow.toLocaleTimeString()}`, balance:0}, {new: true})
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
  
    const getPaymetsHistory = await DEBT.aggregate([{$match:{userId:userId, name:name}} , {$project:{"payments":1, _id:0}}])

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

    console.log(overdueDebts);

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