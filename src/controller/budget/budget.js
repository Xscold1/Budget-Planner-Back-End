//serivces
const budgetService = require('../../service/budget/budget');

//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

const BUDGET_PLANNER_ALLOCATOR = async (req , res) =>{
  try {
    const response = await budgetService.BUDGET_PLANNER_ALLOCATOR(req.body, req.query);

    return res.json({...SUCCESS_MESSAGE.USER_SUCCESS_ALLOCATION, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const EXPENSE_ALLOCATOR = async (req, res) => {
  try {
    const response = await budgetService.EXPENSE_ALLOCATOR(req.body, req.query);

    return res.json({...SUCCESS_MESSAGE.EXPENSE_ADDED_SUCCESS, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const ADD_USER = async (req, res) => {
  try {
    const response = await budgetService.ADD_USER(req.body, req.query)
    
    return res.json({...SUCCESS_MESSAGE.UPDATE_NOTIFICATION, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const DELETE_USER_FROM_BUDGET = async(req, res) => {
  try {
    await budgetService.DELETE_USER_FROM_BUDGET(req.body, req.query)
    
    return res.json({...SUCCESS_MESSAGE.DELETED_SUCCESSFULLY});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const DELETE_CATEGORY = async (req, res) => {
  try {
    await budgetService.DELETE_USER_FROM_BUDGET(req.body, req.query)
    
    return res.json({...SUCCESS_MESSAGE.DELETED_SUCCESSFULLY});
  } catch (error) {
    onsole.log(error);
    if(error.message) return res.json(error);
  }
}
const EDIT_BUDGET_PLANNER = async (req, res) =>{
  try {
    const response = await budgetService.EDIT_BUDGET_PLANNER(req.body, req.query)
    
    return res.json({...SUCCESS_MESSAGE.UPDATE_NOTIFICATION, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const EDIT_CATEGORY_PLANNER = async (req, res) =>{
  try {
    
    const response = await budgetService.EDIT_CATEGORY_PLANNER(req.body, req.query)
    return res.json({...SUCCESS_MESSAGE.UPDATE_NOTIFICATION, response})
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_CATEGORY_PLANNER = async (req, res) =>{
  try {
    const response = await budgetService.GET_CATEGORY_PLANNER(req.query)
    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_TRANSACTION = async (req, res) =>{
  try {
    const response = await budgetService.GET_TRANSACTION(req.query)
    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_INSIGHT = async (req, res) =>{
  try {
    const response = await budgetService.GET_INSIGHT(req.query);
    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_BUDGET_PLANNER = async (req, res) =>{
  try {
    const response  = await budgetService.GET_BUDGET_PLANNER(req.query)

    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_ALL_BUDGET_NAME = async (req, res) =>{
  try {
    const response  = await budgetService.GET_ALL_BUDGET_NAME(req.query)

    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT = async (req, res) => {
  try {
    const response  = await budgetService.GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT(req.query)

    return res.json({...SUCCESS_MESSAGE.FETCH_SUCCESS, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

module.exports = {
  BUDGET_PLANNER_ALLOCATOR,
  EXPENSE_ALLOCATOR,
  ADD_USER,
  DELETE_USER_FROM_BUDGET,
  DELETE_CATEGORY,
  GET_BUDGET_PLANNER,
  GET_CATEGORY_PLANNER,
  GET_TRANSACTION,
  EDIT_BUDGET_PLANNER,
  EDIT_CATEGORY_PLANNER,
  GET_INSIGHT,
  GET_ALL_BUDGET_NAME,
  GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT
}