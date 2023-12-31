const jwt = require("jsonwebtoken");

const jwtSecret = process.env.SECRET;

module.exports = function (req, res, next) {

  try {
    const bearerToken = req.headers.authorization;

    if(!bearerToken){
      throw { statusCode: 500, message: "No token, authorization denied" };
    }
    const token = bearerToken.split(' ')[1];

    if (!token) {
      throw { statusCode: 500, message: "No token, authorization denied" };
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    
    req.authPayload = decoded;
    next();
  } catch (error) {
    console.log('error', error)
    res.status(200).send({
      status: 'FAILED',
      status_code: error.statusCode || 500,
      message: error.message || 'Please contact administrator'}
    );
  }
};