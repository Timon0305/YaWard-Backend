const express = require('express');
const multer = require('multer');
const jwt_decode = require('jwt-decode');

const router = express.Router();

const errorResponse = require('../../utils/errorResponse');
const Product = require('../../models/productModel/Product');
const Category = require('../../models/categoryModel/Category');
const Occasion = require('../../models/occasionModel/Occasion');
const Shop = require('../../models/shopModel/Shop');
const MyWishList = require('../../models/customerModel/MyWishlist');

router.post('/getAllProducts', (req, res) => {
    const active = 'active';
    const shopId = req.body.shopId;
    const flowerNum = req.body.flowerNum;
    try {
        Shop.findOne({_id: shopId}, (err, shop) => {
            if (err) {
                return res.status(404).json({
                    success: false,
                    msg: errorResponse.StatusCode.NOT_FOUND_ERR
                })
            }

            else {
                const vendorId = shop['id'];

                Product.find({status: active, vendor_id: vendorId})
                    .then(allProduct => {
                        const dataNum = allProduct.length;
                        const flower = flowerNum <= dataNum ? flowerNum : dataNum;
                        const product = [];
                        for (let i = 0; i < flower; i++) {
                            product.push(allProduct[i])
                        }
                        return res.status(200).json({
                            product: product,
                            shop: shop
                        })

                    })
                    .catch(() => {
                        return res.status(200).json({
                            success: false,
                            msg: errorResponse.StatusCode.NOT_FOUND_ERR
                        })
                    })
            }
        })
    } catch (e) {
        return res.status(200).json({
            success: false,
            msg: errorResponse.StatusCode.NOT_FOUND_ERR
        })
    }
});

router.post('/filterProducts', (req, res) => {
    const flowerNum = req.body.flowerNum;
    const filter = req.body.filterText;
    const active = 'active';
    const shopId = req.body.shopId;
    const category = req.body.categoryName === '' ? /^/ : req.body.categoryName;
    const occasion = req.body.occasionName === '' ? /^/ : req.body.occasionName;
    const title = filter === '' ? /^/ : new RegExp('.*' + filter + '.*');
    try {
        Shop.findOne({_id: shopId}, (err, shop) => {
            if (err) {

            } else {
                const vendorId = shop['id'];
                Product.find({title: title, categoryName: category, occasionName: occasion,status: active, vendor_id: vendorId })
                    .then(allProduct => {
                        const dataNum = allProduct.length;
                        const flower = flowerNum <= dataNum ? flowerNum : dataNum;
                        const product = [];
                        for (let i = 0; i < flower; i++) {
                            product.push(allProduct[i])
                        }
                        return res.status(200).json({
                            product
                        })
                    })
            }
        })
    } catch (e) {
    }
});

router.get('/getCategory', (req, res) => {
    try {
        Category.find()
            .then(category => {
                let categories = [];
                for (let item of category) {
                    if (item['status'] === 'active') {
                        categories.push(item['title'])
                    }
                }
                return res.status(200).json({
                    categories
                })
            })
    } catch (e) {
        console.error(e)
    }
});

router.get('/getOccasion', (req, res) => {
    try {
        Occasion.find()
            .then(occasion => {
                let occasions = [];
                for (let item of occasion) {
                    if (item['status'] === 'active') {
                        occasions.push(item['title'])
                    }
                }
                return res.status(200).json({
                    occasions
                })
            })
    } catch (e) {
        console.error(e)
    }
});

router.post('/getCategoryProduct', (req, res) => {
    const category = req.body.category;
    Product.find({category: category})
        .then(product => {
            return res.status(200).json({
                product
            });
        })
        .catch(err => console.log(err))
});

router.post('/addWishList', (req, res) => {
    const flower_id = req.body.flowerId;
    const shop_id = req.body.shopId;
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    try {
        MyWishList.findOne({flower_id: flower_id, customer_id: customer_id}, (err, flower) => {
            if (flower) {
                flower['status'] = flower['status'] === false;
                flower.save()
                    .then(() => {
                        MyWishList.find({customer_id: customer_id, shop_id: shop_id}, (err, wishList) => {
                            return res.status(200).json({
                                wishList: wishList,
                                success: true,
                                msg: errorResponse.StatusCode.SUCCESS_CODE
                            })
                        })
                    }).catch(err => console.error(err))
            } else {
                const myWishList = new MyWishList({
                    customer_id, flower_id, shop_id
                });
                myWishList.save()
                .then(() => {
                    MyWishList.find({customer_id: customer_id, shop_id: shop_id}, (err, wishList) => {
                        return res.status(200).json({
                            wishList: wishList,
                            success: true,
                            msg: errorResponse.StatusCode.SUCCESS_CODE
                        })
                    })
                }).catch(err => console.error(err.message))
            }
        })
    } catch (e) {
        console.error(e.message)
    }
});

router.post('/getMyWishList', (req, res) => {
    const shopId = req.body.shopId;
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    if (token) {
        try {
            MyWishList.find({shop_id: shopId, customer_id: customer_id}, (err, wishList) => {
                return res.status(200).json({
                    wishList: wishList,
                    success: true,
                    msg: errorResponse.StatusCode.SUCCESS_CODE
                })

            })
        } catch (e) {

        }
    } else {
        return res.json({
            wishList: '',
            success: false
        })
    }

});

module.exports = router;