const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();

const errorResponse = require('../../utils/errorResponse');
const Customer = require('../../models/customerModel/Customer');
const Occasion = require('../../models/occasionModel/Occasion');
const Product = require('../../models/productModel/Product');
const Shop = require('../../models/shopModel/Shop');
const MyOccasion = require('../../models/customerModel/MyOccasion');
const MyWishList = require('../../models/customerModel/MyWishlist');

router.post('/addAccountInformation', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const phone = decodedToken['result']['phone'];
    const username = req.body.username;
    const email = req.body.email;
    const birthday = req.body.birthday;
    const gender = req.body.gender === '' ? 'Male' : req.body.gender;
    try {
        Customer.findOne({phone: phone}, (err, customer) => {
            customer['first_name'] = username.split(' ')[0];
            customer['last_name'] = username.split(' ')[1] !== undefined ? username.split(' ')[1] : '' ;
            customer['email'] = email;
            customer['birthday'] = birthday;
            customer['gender'] = gender;
            customer['status'] = customer['status'] === undefined ? 'pending': customer['status'];
            customer['updated_at'] = new Date();
            customer.save();
            return res.status(200).json({
                msg: errorResponse.StatusCode.SUCCESS_CODE,
                success: true,
                customer
            })
        })

    } catch (e) {
        console.log(e)
    }
});

router.get('/getMyAccount', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const phone = decodedToken['result']['phone'];
    try {
        Customer.findOne({phone: phone}, (err, customer) => {
            customer['first_name'] = customer['first_name'] === null ? '' : customer['first_name'];
            customer['last_name'] = customer['last_name'] === null ? '' : customer['last_name'];
            return res.status(200).json({
                customer: customer
            })
        })
    } catch (e) {
        throw e
    }
});

router.post('/getUserName', (req, res) => {
    const phone = req.body.formData['phone'];
    try {
        Customer.findOne({phone: phone}, (err, customer) => {
            return res.json({
                customer: customer
            })
        })
    } catch (e) {
        throw e
    }
});

router.post('/addAddress', (req, res) => {
    const recipient = req.body.myAddress['recipient'];
   const phone = req.body.myAddress['phone'];
   const address = req.body.formData['address'];
   try {
       Customer.findOne({phone: phone}, (err, customer) => {
           customer['recipient'] = recipient;
           customer['address'] = address;
           customer.save();
           return res.json({
               msg: errorResponse.StatusCode.SUCCESS_CODE,
               success: true,
               customer: customer
           })
       })
   } catch (e) {
       throw e
   }
});

router.get('/getAddress', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const phone = decodedToken['result']['phone'];
    try {
        Customer.findOne({phone: phone}, (err, customer) => {
            return res.json({
                customer: customer,
                success: true,
                msg: errorResponse.StatusCode.SUCCESS_CODE
            })
        })
    } catch (e) {
        throw e
    }
});

router.post('/deleteAddress', (req, res) => {
    const phone = req.body.phone;
    try {
        Customer.findOne({phone: phone}, (err, customer) => {
            customer['recipient'] = '';
            customer['address'] = '';
            customer.save();
            return res.json({
                customer: customer,
                success: true,
                msg: errorResponse.StatusCode.SUCCESS_CODE
            })
        })
    } catch (e) {
        throw e
    }
});

router.get('/getOccasionList', (req, res) => {
    try {
        Occasion.find()
            .then(occasion => {
                return res.status(200).json({
                    occasion
                })
            })
    } catch (e) {
        throw e;
    }
});

router.post('/addNewOccasion', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    const {title, occasionType, occasionDate} = req.body;
    const occasionRemain = req.body.occasionRemain === '' ? '3 Days' : req.body.occasionRemain;
    try {
        const myOccasion = new MyOccasion({
            customer_id, title, occasionType, occasionDate, occasionRemain,
        });
        myOccasion.save()
            .then(() => {
                MyOccasion.find({customer_id: customer_id}, (err, occasion) => {
                    return res.status(200).json({
                        occasion: occasion,
                        success: true,
                        msg: errorResponse.StatusCode.SUCCESS_CODE
                    })
                })
            });

    } catch (e) {
        console.log(e);
        return res.json(500).send({
            success: false,
            msg: errorResponse.StatusCode.SERVER_ERROR
        })
    }

});

router.get('/getMyOccasion', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    try {
        MyOccasion.find({customer_id: customer_id}, (err, occasion) => {
            return res.status(200).json({
                occasion
            })
        })
    } catch (e) {
        throw e;
    }
});

router.post('/deleteOccasion', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    const id = req.body.id;
    try {
        MyOccasion.remove({_id: id}, (err, myOccasion) => {
            if (myOccasion['deletedCount']) {
                MyOccasion.find({customer_id: customer_id}, (err, occasion) => {
                    return res.status(200).json({
                        occasion
                    })
                })
            }
        })
    } catch (e) {
        console.error(e.message)
    }
});

router.post('/editNewOccasion', (req, res) => {
    const {id, title, occasionType, occasionDate, occasionRemain} = req.body;
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    try {
       MyOccasion.findOne({_id: id}, (err, myOccasion) => {
           myOccasion['title'] = title === '' ? myOccasion['title'] : title;
           myOccasion['occasionType'] = occasionType === '' ? myOccasion['occasionType'] : occasionType;
           myOccasion['occasionDate'] = occasionDate === '' ? myOccasion['occasionDate'] : occasionDate;
           myOccasion['occasionRemain'] = occasionRemain === '' ? myOccasion['occasionRemain'] : occasionRemain;
           myOccasion['updated_at'] = new Date();
           myOccasion.save()
               .then(() => {
                   MyOccasion.find({customer_id: customer_id}, (err, occasion) => {
                       return res.status(200).json({
                           occasion
                       })
                   })
               });
       })
    } catch (e) {
        console.log(e);
        return res.json(500).send({
            success: false,
            msg: errorResponse.StatusCode.SERVER_ERROR
        })
    }
});

router.get('/getMyWishList', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    try {
        MyWishList.find({customer_id: customer_id, status: true}, async (err, wishlist) => {
            let result = [];
            for (let i = 0 ; i < wishlist.length; i++) {
                let item = {};
                const flowerId = wishlist[i]['flower_id'];
                const shopId = wishlist[i]['shop_id'];
                await Product.findOne({_id: flowerId})
                    .then(product => {
                        item.product = product;
                    });
                await Shop.findOne({_id: shopId})
                    .then(shop => {
                        item.shop = shop;
                    });
                result.push(item)
            }
            return res.json({
                wishlist: result
            })
        })
    } catch (e) {

    }
});

module.exports = router;