const express = require('express');
const router = express.Router();
const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const multer = require('multer');

const Vendor = require('../../models/vendorModel/Vendor');

router.post('/register', (req, res) => {
    const {username, email, password, store, legal, phone, address, cr, cr_image, vat, vat_image, map, bank, ban} = req.body;
    if (!req.body) {
        res.status(500).send({
            msg: "Server Error"
        })
    }

    Vendor.findOne({email: email})
        .then(user => {
            if (user) {
                res.send({
                    success: false,
                    msg: "User Email is already existed"
                });
            } else {
                const newVendor = new Vendor({
                    username, email, password, store, legal, phone, address, cr, cr_image, vat, vat_image, map, bank, ban
                });
                newVendor.cr_image = cr_image.slice(12);
                newVendor.vat_image = vat_image.slice(12);
                const salt = genSaltSync(10);
                newVendor.password = hashSync(newVendor.password, salt);
                newVendor.save()
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

let storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/vendorInfo/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage}).single('cr_file');

router.post('/addVendorCRFile', (req, res) => {
    upload( req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

const upload1 = multer({storage: storage}).single('vat_file');

router.post('/addVendorVATFile', (req, res) => {
    upload1( req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});


router.post('/login', (req, res, err) => {
    const {email, password} = req.body;
    Vendor.findOne({email: email})
        .then(user => {
            if (!user) {
                res.status(200).json({
                    success: false,
                    data: null,
                    msg: 'Email doesn`t exit'
                })
            }
            else {
                if (user.value === "active") {
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
                    return res.status(200).json({
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