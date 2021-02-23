const express = require('express');
const router = express.Router();
const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const passport = require('passport');


const Admin = require('../../models/adminModel/Admin');

router.post('/register', (req, res) => {
    const {username, email, password, role, status, created_at, updated_at, deleted_at} = req.body;

    if (!req.body) {
        res.status(500).send({
            msg: "Server Error"
        })
    }

    // Check Email
    Admin.findOne({email: email})
        .then(user => {
            if (user) {
                res.send({
                    success: false,
                    msg: "User Email is already existed"
                });
            } else {
                const newAdmin = new Admin({
                    username, email, password, role, status, created_at, updated_at, deleted_at
                });
                const salt = genSaltSync(10);
                newAdmin.password = hashSync(newAdmin.password, salt);
                newAdmin.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered');
                        res.send({
                            success: true,
                            data: user,
                            msg: 'Successfully registered'
                        })
                    })
                    .catch(err => console.log(err))
            }

        })
});

router.post('/login', (req, res, err) => {
    const {email, password} = req.body;
    Admin.findOne({email: email})
        .then(user => {
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: null,
                    msg: 'Email doesn`t exit'
                })
            }
           else {
                if (user.status === "active") {
                    const passwordCompare = compareSync(password, user.password);
                    if (passwordCompare) {
                        user.password = undefined;
                        const jsonToken = sign({result: user}, 'yaward', {
                            expiresIn: '24h'
                        });
                        return res.status(200).json({
                            success: true,
                            data: user,
                            msg: 'Successfully',
                            token: jsonToken
                        })
                    } else {
                        return res.status(200).json({
                            success: false,
                            msg: 'Invalid Password'
                        })
                    }
                } else {
                    return res.status(401).json({
                        success: false,
                        msg: 'Not Allowed'
                    })
                }
            }
        }).catch(err => {
        console.log(err);
    })
});

module.exports = router;