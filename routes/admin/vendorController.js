const express = require('express');
const {genSaltSync, hashSync} = require('bcryptjs');
const multer = require('multer');

const errorResponse = require('../../utils/errorResponse');
const router = express.Router();


const Vendor = require('../../models/vendorModel/Vendor');
const Product = require('../../models/productModel/Product');

let storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/vendorInfo/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

router.get('/getVendorList', (req, res) => {
    const deleted_at = null;
    Vendor.find({deleted_at: deleted_at})
        .then(vendor => {
            return res.status(200).json({
                vendor
            })

        })
});

router.post('/vendorActive', (req, res) => {
    const vendorId = req.body['id'];
    const status = req.body['status'];

    try {
        Vendor.findOne({_id: vendorId}, (err, user) => {
            status === 'pending' ? user['value'] = 'active' : user['value'] = 'pending';
            user['updated_at'] = new Date();
            user.save();
            return res.json({
                user
            })
        })
    } catch (e) {
        console.log(e)
    }
});

// router
router.post('/addVendors', (req, res) => {
    const {username, email, password, store, legal, phone, cr, cr_image, vat, vat_image, map, bank, ban, commission_rate, value, role} = req.body;
    try {
        Vendor.findOne({email: email})
            .then(user => {
                if (user) {
                    return res.status(200).json({
                        success: false,
                        msg: errorResponse.StatusCode.DUPLICATE_EMAIL
                    })
                }
                else {
                    const newVendor = new Vendor({
                        username,
                        email,
                        password,
                        store,
                        legal,
                        phone,
                        cr,
                        cr_image,
                        vat,
                        vat_image,
                        map,
                        bank,
                        ban,
                        commission_rate,
                        value,
                        role
                    });
                    const salt = genSaltSync(10);
                    newVendor.password = hashSync(newVendor.password, salt);
                    newVendor.cr_image = cr_image.slice(12);
                    newVendor.vat_image =vat_image.slice(12);
                    newVendor.save()
                        .then(user => {
                            req.flash('success_msg', 'Vendor added');
                            res.status(200).send({
                                success: true,
                                data: user,
                                msg: errorResponse.StatusCode.SUCCESS_CODE
                            })
                        })
                        .catch(err => console.log(err))
                }
            })
    } catch (e) {
        console.log(e);
        return res.json(500).send({
            success: false,
            msg: errorResponse.StatusCode.SERVER_ERROR
        })
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



router.post('/deleteVendor', (req, res) => {
    const vendorId = req.body.id;

    try {
        Vendor.findOne({_id: vendorId}, (err, user) => {
            user['deleted_at'] = new Date();
            user['created_at'] = null;
            user['updated_at'] = null;
            user['value'] = 'deleted';
            user.save();
            return res.status(200).json({
                success: true,
                msg: errorResponse.StatusCode.SUCCESS_CODE
            })
        })

    } catch (e) {
        console.log(e)
    }
});

router.post('/getDeletedVendorList', (req, res) => {
    const created_at = req.body.created_at;
    Vendor.find({created_at: created_at})
        .then(vendor => {
            return res.status(200).json({
                vendor
            })
        })
});

router.post('/vendorBlockToActive', (req, res) => {
    const vendorId = req.body['id'];

    try {
        Vendor.findOne({_id: vendorId}, (err, user) => {
            user['value'] = 'active';
            user['updated_at'] = new Date();
            user['deleted_at'] = null;
            user.save();
            return res.json({
                user
            })
        })
    } catch (e) {
        console.log(e)
    }
});

router.post('/editVendors', (req, res) => {
    const {id, username, email, password, store, legal, phone, cr, cr_image, vat, vat_image, map, bank, ban, commission_rate, value} = req.body;
    try {
        Vendor.findOne({_id: id}, (err, user) => {
            const salt = genSaltSync(10);
            user['username'] = username;
            user['email'] = email;
            user['password'] = password === '' ? user['password'] : hashSync(password, salt);
            user['store'] = store;
            user['legal'] = legal;
            user['phone'] = phone;
            user['cr'] = cr;
            user['cr_image'] = cr_image === '' ? user['cr_image'] : cr_image.slice(12);
            user['vat'] = vat;
            user['vat_image'] = vat_image === '' ? user['vat_image'] : vat_image.slice(12);
            user['map'] = map;
            user['bank'] = bank;
            user['ban'] = ban;
            user['commission_rate'] = commission_rate;
            user['value'] = value === '' ? user['value'] : value;
            user['updated_at'] = new Date();
            user.save();
            return res.status(200).json({
                msg: errorResponse.StatusCode.SUCCESS_CODE,
                success: true,
                user
            })
        })
    } catch (e) {
        console.log(e)
    }
});

router.post('/getProductInfo', (req, res) => {
    const id = req.body.id;
    Product.find({user_id: id})
        .then(product => {
            let productNum = 0;
            for (let item of product) {
               if (item['status'] === 'active') {
                   productNum += parseInt(item['quantity'])
               }
            }
            return res.status(200).json({
                productNum
            })
        })
        .catch(err => console.log(err))
});
module.exports = router;