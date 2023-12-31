//models
const BUDGET = require('../../models/budget-model');
const EXPENSES = require('../../models/expense-model');
const USER = require('../../models/user-model');
const REQ_ACCESS = require('../../models/request-access');
const EXTRA_BUDGET = require('../../models/extra-budget');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

//utils
const findUserId = require('../../utils/findUserId');
const formatExpenses = require('../../utils/formatExpenses');
const getDateToday = require('../../utils/getDateToday');
const transporter = require('../../utils/nodemailer');

const BUDGET_PLANNER_ALLOCATOR = async (reqBody, reqQuery) =>{
  try {

    const {email} = reqQuery
    const {startDate, totalBudget,needs,wants,savings, budgetType, budgetName, iconId, budgetRatio} = reqBody

    const checkIfNewUser = await USER.findOne({email: email})

    if(checkIfNewUser.ifNewUser === true) await USER.updateOne({email: email}, {$set: {ifNewUser:false}})

    const userId = checkIfNewUser._id

    const budgetPayload = {
      startDate,
      budgetName: `${budgetName}~${email}`,
      totalBudget,
      remainingBudget: totalBudget,
      needs,
      wants,
      savings,
      budgetType,
      iconId,
      userId,
      budgetRatio,
      budgetOwner:email,
    }

    const budget = await BUDGET.create(budgetPayload)

    return budget;

  }catch (error) {
    throw error;
  }
}

const EXPENSE_ALLOCATOR = async (reqBody, reqQuery) => {
  try {

    const {budgetName, email} = reqQuery
    const {amount, note, expenseType, category} = reqBody;

    const userId = await findUserId(email)

    const expensePayload = {
      amount,
      category,
      note,
      budgetName,
      expenseType,
      userId,
      createdAt: getDateToday()
    }
    
    const newExpense = await EXPENSES.create(expensePayload)

    const curBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName})

    await BUDGET.findOneAndUpdate({ userId:{$in: [userId]},budgetName:budgetName,[`${expenseType}.name`]: category },{$push:{[`${expenseType}.$[element].expenses`]:newExpense._id }},{arrayFilters:[{ 'element.name': category }]});
    
    const expense = Number(curBudget.totalExpenses) + Number(amount);
    
    await BUDGET.findOneAndUpdate({userId: {$in:[userId]}, budgetName:budgetName}, {
      totalExpenses: expense,
      remainingBudget: Number(curBudget.totalBudget) - Number(expense),
    })

    return newExpense;
  } catch (error) {
    throw error;
  }
}

const ADD_USER = async (reqBody, reqQuery) =>{
  try {
    const {userEmail} = reqBody

    const {email, budgetName} = reqQuery
    //find the user that you want to add 
    const findUserEmail = await USER.findOne({email:userEmail})
    if(!findUserEmail) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    //find the user id of the user who owns the account 
    const userId = await findUserId(email)

    const checkIfUserAlreadyExistInBudget = await BUDGET.findOne({userId:{$in:[findUserEmail._id]}, budgetName: budgetName})

    if(checkIfUserAlreadyExistInBudget) throw (ERROR_MESSAGE.USER_ALREADY_EXIST_IN_THE_BUDGET)

    const addUserToBudget = await BUDGET.findOneAndUpdate({budgetName:budgetName, userId: {$in:[userId]}}, {$push: {userId: findUserEmail._id}}, {new: true})

    return addUserToBudget
  } catch (error) {
    throw error;
  }
}

const ADD_EXTRA_BUDGET = async (reqBody, reqQuery) => {
  try {
    const {budgetOwner, budgetName} = reqQuery
    const {amount, dateToBeAdded, note , } = reqBody

    const createPayload = {
      budgetOwner,
      budgetName,
      amount,
      dateToBeAdded,
      note
    }

    console.log(createPayload)

    await EXTRA_BUDGET.create(createPayload)

    return true
  } catch (error) {
    throw error
  }
}

const CHECK_EXTRA_BUDGET = async (reqQuery) => {
  try {
    const {budgetOwner, budgetName} = reqQuery

    process.env.TZ

    const isPastDate = await EXTRA_BUDGET.findOne({budgetOwner, budgetName})

    const currentDate = new Date(Date.now())

    if(isPastDate.dateToBeAdded < currentDate) {
      await BUDGET.findOneAndUpdate({budgetOwner, budgetName},{$inc:{totalBudget:amount, remainingBudget:amount}})
      await EXTRA_BUDGET.deleteOne({budgetOwner})
    }

    return true
  } catch (error) {
    throw error
  }
}

const GIVE_MONEY = async (reqBody, reqQuery) => {
  try {
    // const {email} = reqQuery

    const {userEmail, budgetName, amount} = reqBody

    await BUDGET.findOneAndUpdate({budgetName: budgetName, budgetOwner:userEmail} , {$inc:{totalBudget:amount, remainingBudget:amount}})

    return true
  } catch (error) {
    throw error
  }
}

const REQUEST_ACCESS = async (reqQuery) => {
  try {

    const {userEmail, budgetOwner} = reqQuery

    const checkIfHasPendingRequest = await REQ_ACCESS.findOne({userEmail , budgetOwner})

    if(checkIfHasPendingRequest) throw (ERROR_MESSAGE.ALREADY_HAS_PENDING_REQUEST)

    await REQ_ACCESS.create({userEmail, budgetOwner})

    const mailOptions = {
      from: "budgetplanner321@gmail.com",
      to: userEmail,
      subject: "Account ",
      text: `
      Dear ${budgetOwner}

      User ${userEmail} has requested to access your budgets please open the app to approve/decline their request
      thankyou
      
      Sincerely,
      B SMART APP   
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        throw error
      }else {
        console.log("link sent successfully")
      }
    });


    return true
  } catch (error) {
    throw error
  }
}

const GRANT_ACCESS = async (reqBody, reqQuery) => {
  try {
    const {userEmail,budgetName, status} = reqBody

    const {budgetOwner} = reqQuery

    //find the user id of the user who owns the account 
    const userId = await findUserId(userEmail)

    if(status === 'deny') {

      await REQ_ACCESS.findOneAndDelete({budgetOwner, userEmail})

      const mailOptions = {
        from: "budgetplanner321@gmail.com",
        to: userEmail,
        subject: "Account ",
        text: `
        Dear ${userEmail}
  
        User ${budgetOwner} has Denied your request
        
        Sincerely,
        B SMART APP   
        `,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          throw error
        }else {
          console.log("link sent successfully")
        }
      });

      return true
    }

    const checkIfUserAlreadyExistInBudget = await BUDGET.findOne({userId:{$in:[userId]}, budgetName: budgetName})

    if(checkIfUserAlreadyExistInBudget) throw (ERROR_MESSAGE.USER_ALREADY_EXIST_IN_THE_BUDGET)

    await BUDGET.findOneAndUpdate({budgetOwner,budgetName} ,{$push: {userId:userId}}, {new: true})

    const mailOptions = {
      from: "budgetplanner321@gmail.com",
      to: userEmail,
      subject: "Account ",
      text: `
      Dear ${userEmail}

      User ${budgetOwner} has accepted your request and you can now access their budget
      
      Sincerely,
      B SMART APP   
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        throw error
      }else {
        console.log("link sent successfully")
      }
    });


    await REQ_ACCESS.findOneAndDelete({budgetOwner, userEmail})

    return true
  } catch (error) {
    throw error
  }
}

const EDIT_BUDGET_PLANNER = async (reqBody, reqQuery) =>{
  try {

    const {email, budgetName} = reqQuery

    const {totalBudget, editBudgetName} = reqBody

    const userId = await findUserId(email)

    const findBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName: budgetName})

    await EXPENSES.updateMany({userId: userId, budgetName: budgetName}, {budgetName: editBudgetName})
    
    const payLoad = {
      budgetName:editBudgetName,
      totalBudget,
      remainingBudget: totalBudget - findBudget.totalExpenses
    }
    
    const updateBudget = await BUDGET.findOneAndUpdate({userId:{$in:[userId]}, budgetName:budgetName}, payLoad , {new:true})

    return updateBudget;
  } catch (error) {
    throw error;
  }
}

const EDIT_CATEGORY_PLANNER = async (reqBody, reqQuery) =>{
  try {
    const {email, budgetName} = reqQuery

    const userId = await findUserId(email)

    const updateBudgetCategory = await BUDGET.updateOne({userId:{$in:[userId]}, budgetName:budgetName}, reqBody ,{new:true})

    return updateBudgetCategory;

  } catch (error) {
    throw error;
  }
}

const EDIT_EXPENSES = async (reqBody, reqQuery) =>{
  try {
    const {_id, budgetName} = reqQuery

    const findExpenses = await EXPENSES.findById(_id)

    let initialAmount = findExpenses.amount

    const editExpenses = await EXPENSES.findByIdAndUpdate({_id},reqBody, {new:true})

    if(reqBody.amount){
      let amountToReduce = reqBody.amount - initialAmount
      await BUDGET.findOneAndUpdate({budgetName}, {$inc:{totalExpenses:amountToReduce, remainingBudget:-amountToReduce}})
    }
    return editExpenses;
  } catch (error) {
    throw error;
  }
}

const DELETE_USER_FROM_BUDGET = async(reqBody, reqQuery) =>{
  try {
    const {email, budgetName} = reqQuery

    const {userEmail} = reqBody

    const userId = await findUserId(userEmail)

    const budget = await BUDGET.findOne({ email: email, budgetName: budgetName });
    const userIdArray = budget.userId;

    if(userIdArray[0].toString() === userId.toString()) {
      throw (ERROR_MESSAGE.CANNOT_REMOVE_THE_BUDGET_OWNER)
    }

    await BUDGET.findOneAndUpdate({email: email, budgetName: budgetName}, {$pull:{userId:userId}})

    return true
  } catch (error) {
    throw error;
  }
}

const DELETE_CATEGORY = async (reqQuery) => {
  try {
    const { email, budgetName, expenseType, name } = reqQuery;
    const userId = await findUserId(email);
  
    // Find the updated document to get the expensesToRemove
    const findArrayData = await BUDGET.findOne({
      userId: { $in: [userId] },
      budgetName: budgetName,
      [`${expenseType}.name`]: name,
    });
  
    // Check if findArrayData is not empty and has the expected structure
    if (findArrayData && findArrayData[expenseType] && findArrayData[expenseType][0]) {
      const expensesToRemove = findArrayData[expenseType][0].expenses;
  
      // Find all expenses to calculate the total amount
      const findAllExpensesToRemove = await EXPENSES.find({ _id: { $in: expensesToRemove.map(id => id.toString()) } });
  
      const totalExpensesToRemove = findAllExpensesToRemove.reduce((total, expense) => total + expense.amount, 0);
  
      // Remove expenses from the 'expenses' collection
      const removedExpenses = await EXPENSES.deleteMany({ _id: { $in: expensesToRemove.map(id => id.toString()) } });
  
      // Update the budget document to remove the specified category and update total expenses
      const result = await BUDGET.updateOne(
        { userId: { $in: [userId] }, budgetName: budgetName },
        {
          $pull: {
            [`${expenseType}`]: { name: name },
          },
          $inc: {
            totalExpenses: -totalExpensesToRemove,
            remainingBudget: + totalExpensesToRemove
          },
        }
      );
  
      return true;
    } 
  
  } catch (error) {
    throw error
  }
  
}

const GET_BUDGET_PLANNER = async (reqQuery) => {
  try {
    const {email, budgetName} = reqQuery

    const userId = await findUserId(email)

    const checkIfTimeToReset = await BUDGET.findOne({userId:{$in:[userId]} , budgetName: budgetName, })

        // Check if it's time to reset the expenses
    if (checkIfTimeToReset.budgetType === 'monthly') {
      // Check if it's a new month
      const today = new Date();
      const lastResetDate = new Date(checkIfTimeToReset.lastResetDate);
      
      if (today.getMonth() !== lastResetDate.getMonth() || today.getFullYear() !== lastResetDate.getFullYear()) {
        // Reset expenses for the new month
        await BUDGET.findOneAndUpdate(
          { userId: { $in: [userId] }, budgetName: budgetName },
          {
            totalExpenses: 0,
            remainingBudget: Number(checkIfTimeToReset.totalBudget),
            lastResetDate: today,
            $set: {
              'needs.$[].expenses': [],
              'wants.$[].expenses': [],
              'savings.$[].expenses': [],
            },
          }
        );
      }
    } else if (checkIfTimeToReset.budgetType === 'weekly') {
      // Check if it's a new week (assuming each week starts on Sunday)
      const today = new Date();
      const lastResetDate = new Date(checkIfTimeToReset.lastResetDate);
    
      if (today.getDay() === 0 && today - lastResetDate >= 7 * 24 * 60 * 60 * 1000) {
        // Reset expenses for the new week
        await BUDGET.findOneAndUpdate(
          { userId: { $in: [userId] }, budgetName: budgetName },
          {
            totalExpenses: 0,
            remainingBudget: Number(checkIfTimeToReset.totalBudget),
            lastResetDate: today,
            $set: {
              'needs.$[].expenses': [],
              'wants.$[].expenses': [],
              'savings.$[].expenses': [],
            },
          }
        );
      }
    }

    const findBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName}, { '_id': false}).populate('needs.expenses wants.expenses savings.expenses');

    return findBudget;
  } catch (error) {
    throw error;
  }
}

const GET_CATEGORY_PLANNER = async (reqQuery) =>{
  try {
    const {email, type, budgetName} = reqQuery

    const userId = await findUserId(email)

    const findBudgetCategory = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName}).distinct(type)
    return findBudgetCategory
  } catch (error) {
    throw error;
  }
}

const GET_TRANSACTION = async (reqQuery) =>{
  try {
    const {email, type, budgetName} = reqQuery

    const userId = await findUserId(email)

      if(type === 'monthly'){
        const {month, year} = reqQuery
        const getExpenses = await EXPENSES.find({userId:{$in:[userId]}, budgetName:budgetName , $expr:{$and:[{$eq:[{"$month":"$createdAt"}, month]} ,{$eq:[{"$year":"$createdAt"}, year]}]}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
      
    }else if (type === 'yearly'){
        const {year} = reqQuery
        const getExpenses = await EXPENSES.find({userId:{$in:[userId]} ,budgetName:budgetName, $expr:{$and:[{$eq:[{"$year":"$createdAt"}, year]}]}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
    }else if (type === 'weekly'){
      const {startDate, endDate} = reqQuery

      const getExpenses = await EXPENSES.find({userId:{$in:[userId]},budgetName:budgetName, createdAt:{$lte:endDate, $gte:startDate}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
    }else if (type === 'daily'){
      const { day } = reqQuery

      const endDate = day.concat("T23:59:59.000+00:00")
      const startDate = day.concat("T00:00:00.000+00:00")
      const getExpenses = await EXPENSES.find({userId:{$in:[userId]} ,budgetName:budgetName, createdAt:{$lte:endDate, $gte:startDate}})

      let sum = 0

      getExpenses.map((amount) => {
        sum += Number(amount.amount)
      })
      
      return {
        getExpenses,
        totalSum:sum
      } 
    }else {
      const getExpenses = await EXPENSES.find({userId:{$in:[userId]}})
      return getExpenses
    }
  } catch (error) {
    throw error;
  }
}

const GET_INSIGHT = async (reqQuery) =>{
  try {
    const {email, type, year, month, startDate, endDate, budgetName} = reqQuery

    const monthsConversion = {
      '1': "January",
      '2': "February",
      '3': "March",
      '4': "April",
      '5': "May",
      '6': "June",
      '7': "July",
      '8': "August",
      '9': "September",
      '10': "October",
      '11': "November",
      '12': "December"
    };

    const findUser = await USER.findOne({email: email})
    const userId = findUser._id;


    if(type === 'monthly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:{$in:[userId]}, budgetName:budgetName, $expr:{$eq:[{"$month":"$createdAt"}, Number(month)], $eq:[{"$year":"$createdAt"}, Number(year)]}, expenseType:{$in: ['needs', 'wants', 'savings']}}}, {$group:{_id:{month:{$month:"$createdAt"}},expenses_this_month:{
            $push: {
              category:"$category",
              name:"$name",
              note:"$note",
              type:"$expenseType",
              amount:"$amount",
              createdAt:"$createdAt",
            }
          }
        }
      }
    ])
      const categories = getExpenses.map((getExpenses) => {
        let totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_month)
        let sortExpenses = totalExpenses.sort((amount1, amount2) => {
          return amount2.amount - amount1.amount;
        })
        return {
          month: monthsConversion[getExpenses._id.month],
          expenses: sortExpenses.slice(0, 3)
        }
      });
    return categories
  }else if (type === 'yearly'){
    const getExpenses = await EXPENSES.aggregate([{$match:{userId:{$in:[userId]}, budgetName:budgetName, $expr:{$eq:[{"$year":"$createdAt"}, Number(year)]}, expenseType:{$in: ['needs', 'wants', 'savings']}}}, {$group:{_id:{year:{$year:"$createdAt"}},expenses_this_year:{
          $push: {
            category:"$category",
            name:"$name",
            note:"$note",
            type:"$expenseType",
            amount:"$amount",
            createdAt:"$createdAt"
          }
        }
      }
    }
  ])
  const categories = getExpenses.map((getExpenses) => {
    const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_year)
    let sortExpenses = totalExpenses.sort((amount1, amount2) => {
      return amount2.amount - amount1.amount;
    })
    return {
      year: getExpenses._id.year,
      expenses: sortExpenses.slice(0, 3)
    }
  });
    return categories
  }else if (type === 'weekly'){

    const getExpenses = await EXPENSES.aggregate([{$match:{
      userId:{$in:[userId]},
      budgetName:budgetName,
      createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    expenseType:{$in: ['needs', 'wants', 'savings']}}}, {$group:{_id:{week:{$week:"$createdAt"}},expenses_this_week:{
          $push: {
            category:"$category",
            name:"$name",
            note:"$note",
            type:"$expenseType",
            amount:"$amount",
            createdAt:"$createdAt"
          }
        }
      }
    }
  ])
    const categories = getExpenses.map((getExpenses) => {
      const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_week)
      let sortExpenses = totalExpenses.sort((amount1, amount2) => {
        return amount2.amount - amount1.amount;
      })
      return {
        weekly: getExpenses._id.week,
        expenses: sortExpenses.slice(0, 3)
      }
    });
  return categories
  }
  } catch (error) {
    throw error;
  }
}

const GET_ALL_BUDGET_NAME = async (reqQuery) => {
  try {
    const {email} = reqQuery
    const userId = await findUserId(email)

    const findBudgetName = await BUDGET.find({userId: {$in:[userId]}}, {budgetName:1, budgetType:1,budgetOwner:1,_id:0})

    return findBudgetName
  } catch (error) {
    throw error    
  }
}

const GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT = async (reqQuery) => {
  try {
    const {email, budgetName} = reqQuery

    const userId = await findUserId(email)

    const findUserAlongWithBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName})

    if (!findUserAlongWithBudget) return null
    
    const userNames = []

    for (let user of findUserAlongWithBudget.userId){
      let getUserName = await USER.findOne({_id: user})
      userNames.push({userName:getUserName.userName, Images: getUserName.imageUrl, Email: getUserName.email})
    }
    return userNames
  } catch (error) {
    throw error
  }
}

const GET_ALL_REQUEST_ACCESS = async (reqQuery) => {
  try {
    const {budgetOwner} = reqQuery

    const findAllRequestAccess = await REQ_ACCESS.find({budgetOwner})

    return findAllRequestAccess
  } catch (error) {
    throw error
  }
}

const GET_ALL_EXTRA_BUDGETS = async (reqQuery) => {
  try {
    const {budgetOwner, budgetName} = reqQuery

    const findAllExtraBudget = await EXTRA_BUDGET.find({budgetOwner, budgetName})

    return findAllExtraBudget
  } catch (error) {
    throw error
  }
}

module.exports = {
  BUDGET_PLANNER_ALLOCATOR, 
  EXPENSE_ALLOCATOR,
  ADD_USER,
  ADD_EXTRA_BUDGET,
  CHECK_EXTRA_BUDGET,
  GIVE_MONEY,
  REQUEST_ACCESS,
  GRANT_ACCESS,
  EDIT_BUDGET_PLANNER,
  EDIT_CATEGORY_PLANNER,
  EDIT_EXPENSES,
  DELETE_USER_FROM_BUDGET,
  DELETE_CATEGORY,
  GET_BUDGET_PLANNER,
  GET_CATEGORY_PLANNER,
  GET_TRANSACTION,
  GET_INSIGHT,
  GET_ALL_BUDGET_NAME,
  GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT,
  GET_ALL_REQUEST_ACCESS,
  GET_ALL_EXTRA_BUDGETS
}