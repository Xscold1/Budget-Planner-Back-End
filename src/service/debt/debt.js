//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

//utils
const findUserId = require('../../utils/findUserId');
const getDateToday = require('../../utils/getDateToday');

//models
const DEBT = require('../../models/debt-model')

const BORROW_AND_LEND = async(reqBody , reqQuery) =>{
  try {
    const {email} = reqQuery
    const {dueDate, name, interest, status, totalDebt, debtType} = reqBody

    const userId = await findUserId(email)

    const checkIfDebtExist = await DEBT.findOne({userId:userId, name:name})

    if(checkIfDebtExist && checkIfDebtExist.status !== 'paid' ) {
      throw (ERROR_MESSAGE.DEBT_ALEADY_EXIST)
    }
    
    const createPayload = {
      dueDate,
      totalDebt,
      balance : totalDebt,
      name,
      interest,
      status,
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

    const {email} = reqQuery

    const userId = await findUserId(email)

    const {payments, name} = reqBody

    const checkIfDebtIsPaid = await DEBT.findOne({userId:userId, name:name})

    if(checkIfDebtIsPaid.totalDebt <= 0 ){
      const updateDebtStatus = await DEBT.findOneAndUpdate({userId:userId, name:name}, {status: "paid"}, {new: true})
      return updateDebtStatus
    }

    const payDebt = await DEBT.findOneAndUpdate({userId:userId, name: name} , {$inc:{"balance": -payments.amount},$push:{payments:{ amount:payments.amount, paymentDate:getDateToday()}}}, {new: true})

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
    const {email, debtType} = reqQuery
    const userId = await findUserId(email)

    const getLendList = await DEBT.aggregate([{$match:{userId:userId, debtType:debtType}}])

    if(!getLendList) throw (SUCCESS_MESSAGE.FETCH_SUCCESS_NO_DATA)

    return getLendList
  } catch (error) {
    throw error
  }
}
module.exports = {
  BORROW_AND_LEND,
  RECEIVE_AND_PAY,
  GET_PAYMENTS,
  GET_LEND_LISTS,
}