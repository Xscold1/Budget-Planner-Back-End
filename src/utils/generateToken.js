const jwt = require("jsonwebtoken");

module.exports = generateToken = (data) => {
    let jwtSecretKey = process.env.SECRET;

    const expirationTime = '1d';
    const token = jwt.sign(data,jwtSecretKey,{
        expiresIn: expirationTime
    });

    return token;
}
