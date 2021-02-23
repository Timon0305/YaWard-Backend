const express = require('express');
const axios = require('axios');
const {sign} = require('jsonwebtoken');

const router = express.Router();

const Customer = require('../../models/customerModel/Customer');

router.post('/verify', (req, res) => {
    const phoneNumber = req.body.phone;
    if (phoneNumber === undefined || phoneNumber.length <= 7) {
        return res.json({
            success: false,
            msg: 'Invalid Phone Number'
        })
    } else {
        const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        let nowTime = new Date().toISOString().slice(0,16);
        console.log('Is your verify code?', verifyCode);
        axios.post('https://4jawaly.net/api/sendsms.php?' +
            'username=Dabbabapp' +
            '&password=123456' +
            '&sender=YAWARDAPP' +
            '&numbers=+'+ phoneNumber +
            '&message=please check your code '+verifyCode+
            '&datetime=' + nowTime, {credential: 'include'})
            .then(function (response) {
                if (response.statusText === 'OK') {
                    return res.status(200).json({
                        success: true,
                        code: verifyCode,
                    })
                }
            })
            .catch(function (error) {
                console.log('error', error.message);
            });
    }

});

router.post('/register', (req, res) => {
    const phone = req.body.phone;
    const first_name = null;
    const last_name = null;
    const email = null;
    const birthday = null;

    if (!req.body) {
        res.status(500).send({
            msg: "Server Error"
        })
    }

    Customer.findOne({phone: phone})
        .then(user => {
            if (user) {
                const jsonToken = sign({result: user}, 'yaward', {
                    expiresIn: '24h'
                });
                res.send({
                    success: true,
                    data: user,
                    token: jsonToken,
                    msg: 'Successfully logined'
                });
            } else {
                const newCustomer = new Customer({
                   first_name, last_name, email, phone, birthday
                });
                newCustomer.save()
                    .then(user => {
                        const jsonToken = sign({result: user}, 'yaward', {
                            expiresIn: '24h'
                        });
                        req.flash('success_msg', 'You are now registered');
                        res.send({
                            success: true,
                            data: user,
                            token: jsonToken,
                            msg: 'Successfully registered'
                        })
                    })
                    .catch(err => console.log(err))
            }

        })
});

module.exports = router;
