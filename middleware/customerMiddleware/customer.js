const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const asyncHandler = require('./customerAsync');
const ErrorResponse = require('../../utils/errorResponse');

exports.customerStatus = asyncHandler(async (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return next(new ErrorResponse('401: Unauthorized', 401));
    }
    try {
        let decodedToken = jwt_decode(token);
        if ((new Date().getTime() + 1)/1000 - decodedToken['exp'] < 86400) {
            if (decodedToken['result']['role'] === 'customer') {
                next();
            }
            else {
                return res.status(403).json({
                    success: false,
                    msg: ErrorResponse.StatusCode.EMAIL_NOT_VERIFIED
                })
            }
        } else {
            return res.status(401).json({
                success: false,
                msg: ErrorResponse.StatusCode.TOKEN_EXPIRE
            })
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: err
        })
    }
});