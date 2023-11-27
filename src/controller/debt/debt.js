//serivces
const debtService = require('../../service/debt/debt');

//constant
const SUCCESS_MESSAGE = require('../../constants/success-message')

const BORROW_AND_LEND = async(req, res) =>{
  try {
    const response  = await debtService.BORROW_AND_LEND(req.body, req.query)

    return res.json({...SUCCESS_MESSAGE.DEBT_CREATED_SUCCESSFULLY, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const RECEIVE_AND_PAY = async(req, res) =>{
  try {
    const response  = await debtService.RECEIVE_AND_PAY(req.body, req.query)

    return res.json({...SUCCESS_MESSAGE.GENERAL_SUCCESS_MESSAGE, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_PAYMENTS = async (req, res) =>{
  try {
    
    const response  = await debtService.GET_PAYMENTS(req.query)

    return res.json({...SUCCESS_MESSAGE.GENERAL_SUCCESS_MESSAGE, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_LEND_LISTS = async (req, res) =>{
  try {
    
    const response  = await debtService.GET_LEND_LISTS(req.query)

    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

module.exports = {
  BORROW_AND_LEND,
  RECEIVE_AND_PAY,
  GET_PAYMENTS,
  GET_LEND_LISTS,
}