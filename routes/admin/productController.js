const express = require('express');
const {genSaltSync, hashSync} = require('bcryptjs');
const multer = require('multer');
const jwt_decode = require('jwt-decode');
const fs = require('fs');

const router = express.Router();

const errorResponse = require('../../utils/errorResponse');
const Product = require('../../models/productModel/Product');
const Vendor = require('../../models/vendorModel/Vendor');
const Category = require('../../models/categoryModel/Category');
const Occasion = require('../../models/occasionModel/Occasion');

let storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/products/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


router.get('/getProductList', (req, res) => {
    Product.find()
        .then(async product => {
            for ( let i = 0; i < product.length; i ++) {
                const vendorId = product[i]['vendor_id'];
                await Vendor.findOne({
                    _id : vendorId
                }).then( name => {
                    product[i]['vendor_id'] = name.username;
                })
            }
            return res.status(200).json({
                product
            })
        })
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

router.get('/getVendor', (req, res) => {
    try {
        Vendor.find()
            .then(vendor => {
                let vendors = [];
                for (let item of vendor) {
                    if (item['value'] === 'active') {
                        vendors.push(item)
                    }
                }
                return res.status(200).json({
                    vendors
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

router.post('/productActive', (req, res) => {
    const productId = req.body['id'];
    const status = req.body['status'];

    try {
        Product.findOne({_id: productId}, (err, user) => {
            status === 'pending' ? user['status'] = 'active' : user['status'] = 'pending';
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

router.post('/addProduct', (req, res) => {
    const {title, description, slug, sku, regular_price, discount_price, quantity, status, image, categoryName, occasionName, vendor_id} = req.body;

    try {
        const newProduct = new Product({
            title,
            description,
            slug,
            sku,
            regular_price,
            discount_price,
            quantity,
            status,
            image,
            categoryName,
            occasionName,
            vendor_id
        });
        newProduct.image = image.slice(12);
        newProduct.save()
            .then(user => {
                req.flash('success_msg', 'Product added');
                res.status(200).send({
                    success: true,
                    data: user,
                    msg: errorResponse.StatusCode.SUCCESS_CODE
                })
            })
            .catch(err => console.log(err))
    } catch (e) {
        console.log(e);
        return res.json(500).send({
            success: false,
            msg: errorResponse.StatusCode.SERVER_ERROR
        })
    }
});

const upload = multer({storage: storage}).single('product_file');

router.post('/addProductFile', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});


router.post('/deleteProduct', (req, res) => {
    const productId = req.body.id;

    try {
        Product.findOne({_id: productId}, (err, user) => {
            user['deleted_at'] = new Date();
            user['status'] = 'blocked';
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
//
router.post('/getDeletedProductList', (req, res) => {
    const status = req.body.status;
    // Product.find({status: status})
    //     .then(product => {
    //         return res.status(200).json({
    //             product
    //         })
    //     })
});

router.post('/productBlockToActive', (req, res) => {
    const vendorId = req.body['id'];

    try {
        Product.findOne({_id: vendorId}, (err, user) => {
            user['status'] = 'active';
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

router.post('/fileUpload', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const user_id = decodedToken['result']['_id'];
    const role = decodedToken['result']['role'];

    let readFile = req.body['file'];
    let file = JSON.parse(readFile);
    for (let item of file) {
        const image = item['image'];
        const title = item['title'];
        const slug = item['slug'];
        const description = item['description'];
        const sku = item['sku'];
        const categoryName = item['categoryName'];
        const occasionName = item['occasionName'];
        const regular_price = item['regular_price'];
        const discount_price = item['discount_price'];
        const quantity = item['quantity'];
        const status = 'active';
        const newProduct = new Product({
            user_id,
            title,
            description,
            slug,
            sku,
            categoryName,
            occasionName,
            regular_price,
            discount_price,
            quantity,
            status,
            role,
            image,
        });
        newProduct.save();
    }
    res.status(200).send({
        success: true,
        msg: errorResponse.StatusCode.SUCCESS_CODE
    })
});

router.post('/editProduct', (req, res) => {
    const {id, title, description, slug, sku, regular_price, discount_price, quantity, status, image, categoryName, occasionName, vendorName} = req.body;
    try {
        Product.findOne({_id: id}, (err, product) => {
            product['title'] = title;
            product['description'] = description;
            product['slug'] = slug;
            product['sku'] = sku;
            product['regular_price'] = regular_price;
            product['discount_price'] = discount_price;
            product['quantity'] = quantity;
            product['status'] = status;
            product['image'] = image === '' ? product['image'] : image.slice(12);
            product['categoryName'] = categoryName;
            product['occasionName'] = occasionName;
            product['vendorName'] = vendorName;
            product['updated_at'] = new Date();
            product.save();
            return res.status(200).json({
                msg: errorResponse.StatusCode.SUCCESS_CODE,
                success: true,
                product
            })
        })
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;