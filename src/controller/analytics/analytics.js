//constants
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

//service
const analyticsService = require('../../service/analytics/analytics');

const ANALYZE = async(req,res)=>{
  try {
    const response  = await analyticsService.ANALYZE(req.query)

    return res.json({...SUCCESS_MESSAGE.USER_SUCCESS_ALLOCATION, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

module.exports = {
  ANALYZE,
}