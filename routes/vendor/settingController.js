const express = require('express');
const {genSaltSync, hashSync} = require('bcryptjs');
const multer = require('multer');
const jwt_decode = require('jwt-decode');

const errorResponse = require('../../utils/errorResponse');

const router = express.Router();

const Vendor = require('../../models/vendorModel/Vendor');
const Shop = require('../../models/shopModel/Shop');

router.get('/getProfile', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];

    Vendor.findOne({_id: user_id})
        .then(vendor => {
            return res.status(200).json({
                vendor
            })
        }).catch(err => console.log(err))

});

router.get('/getAvatarFile', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];
    Shop.findOne({
        id: user_id
    }).then(shop => {
        res.json({
            shop
        })
    })
});

router.post('/shopProfile', (req, res) => {
    const {id, name, avatar, address} = req.body;

    if (!req.body) {
        res.status(500).send({
            msg: "Server Error"
        })
    }

    try {
        Shop.findOne({id: id})
            .then(user => {
                if (user) {
                    user['avatar'] = avatar.slice(12);
                    user['updated_at'] = new Date();
                    user.save()
                        .then(avatar => {
                            req.flash('success_msg', 'Success');
                            res.send({
                                success: true,
                                data: avatar,
                                msg: errorResponse.StatusCode.SUCCESS_CODE
                            })
                        })
                } else {
                    const shopAvatar = new Shop({
                        id, name, avatar, address
                    });
                    shopAvatar.avatar = avatar.slice(12);
                    shopAvatar.save()
                        .then(avatar => {
                            req.flash('success_msg', 'Success');
                            res.send({
                                success: true,
                                data: avatar,
                                msg: errorResponse.StatusCode.SUCCESS_CODE
                            })
                        })
                }
            })
    } catch (e) {
        console.log(e)
    }
});

let storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/shopAvatar/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage}).single('avatar_file');

router.post('/addAvatarFile', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

router.get('/getShopStatus', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];
    Shop.findOne({id: user_id}, (err, shop) => {
        return res.status(200).json({
            shop
        })
    })
});

router.post('/shopStatus', (req, res) => {
    const status = req.body.status;
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];

    Shop.findOne({id: user_id}, (err, shop) => {
        shop['status'] = status;
        shop['updated_at'] = new Date();
        shop.save()
            .then(shop => {
                return res.status(200).json({
                    shop
                })
            })
    })
});

router.get('/getShopTime', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];
    Shop.findOne({id: user_id}, (err, shop) => {
        return res.status(200).json({
            shop
        })
    })
});

router.post('/setShopTime', (req, res) => {
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];
    Shop.findOne({id: user_id}, (err, shop) => {
        shop['startTime'] = startTime;
        shop['endTime'] = endTime;
        shop.save()
            .then(shop => {
                return res.status(200).json({
                    shop
                })
            })
    })
});

module.exports = router;