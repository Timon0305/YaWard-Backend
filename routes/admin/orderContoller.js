const express = require('express');
const {genSaltSync, hashSync} = require('bcryptjs');
const multer = require('multer');
const jwt_decode = require('jwt-decode');

const router = express.Router();

const errorResponse = require('../../utils/errorResponse');
const Order = require('../../models/orderModel/Order');
const Admin = require('../../models/adminModel/Admin');
const Vendor = require('../../models/vendorModel/Vendor');
const Customer = require('../../models/customerModel/Customer');

router.get('/getAllOrders', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const role = decodedToken['result']['role'];

    Order.find()
        .then(async orders => {
            // for (let item of orders) {
            //
            //     const customer_id = item['customer_id'];
            //     await Customer.findOne({_id: customer_id})
            //         .then(user => {
            //             item['customer_phone'] = user['phone']
            //         }).catch(err => console.log(err));
            //
            //     const vendor_id = item['vendor_id'];
            //     await Vendor.findOne({_id: vendor_id})
            //         .then(user => {
            //             const vendor = user['phone'];
            //         }).catch(err => console.log(err));
            //
            //     const created_at = item['created_at'].toISOString().split("T")[0];
            //     const updated_at = item['updated_at'] === null ? 'null' : item['updated_at'].toISOString().split('T')[0];
            //     const deleted_at = item['deleted_at'] === null ? 'null' : item['deleted_at'].toISOString().split('T')[0];
            //     item['created_at_format'] = created_at;
            //     item['updated_at'] = updated_at;
            //     item = {
            //         'update_at': updated_at,
            //         'created_at': created_at,
            //     };
            //     // /console.log(item);
            //
            // }
            return res.status(200).json({
                orders
            })
        }).catch(err=> console.log(err))
});

router.get('/getCompletedOrders', (req, res) => {
    const status = 'Completed';
    Order.find({status: status})
        .then(orders => {
            return res.status(200).json({
                orders
            })
        })
});

router.get('/getPendingOrders', (req, res) => {
    const status = 'Pending';
    Order.find({status: status})
        .then(orders => {
            return res.status(200).json({
                orders
            })
        })
});

router.get('/getDeclinedOrders', (req, res) => {
    const status = 'Declined';
    Order.find({status: status})
        .then(orders => {
            return res.status(200).json({
                orders
            })
        })
});

router.post('/activeOrderStatus', (req, res) => {
    const productId = req.body['id'];
    const status = req.body['status'];
    try {
        Order.findOne({_id: productId}, (err, user) => {
            if (status === 'Pending') {
                user['status'] = 'Completed';
                user['updated_at'] = new Date();
                user['deleted_at'] = null;
            } else {
                user['status'] = 'Pending';
                user['created_at'] = new Date();
                user['updated_at'] = null;
                user['deleted_at'] = null;
            }
            user.save();
            return res.json({
                user
            })
        })
    } catch (e) {
        console.log(e)
    }
});

router.post('/declinedOrder', (req, res) => {
    const productId = req.body['id'];
    try {
        Order.findOne({_id: productId}, (err, user) => {
            user['status'] = 'Declined';
            user['created_at'] = null;
            user['updated_at'] = null;
            user['deleted_at'] = new Date();
            user.save();
            return res.json({
                user
            })
        })
    } catch (e) {
        console.log(e)
    }
});

// // router
// router.post('/addProduct', (req, res) => {
//     let token = req.headers['authorization'];
//     let decodedToken = jwt_decode(token);
//     const user_id = decodedToken['result']['_id'];
//     const {title, description, slug, sku, regular_price, discount_price, quantity, status, image, created_at, updated_at, deleted_at} = req.body;
//
//     try {
//         const newProduct = new Product({
//             user_id,
//             title,
//             description,
//             slug,
//             sku,
//             regular_price,
//             discount_price,
//             quantity,
//             status,
//             image,
//             created_at,
//             updated_at,
//             deleted_at
//         });
//         newProduct.image = new Date().toISOString().slice(0, 13) + '--' + image.slice(12);
//         newProduct.save()
//             .then(user => {
//                 req.flash('success_msg', 'Product added');
//                 res.status(200).send({
//                     success: true,
//                     data: user,
//                     msg: errorResponse.StatusCode.SUCCESS_CODE
//                 })
//             })
//             .catch(err => console.log(err))
//     } catch (e) {
//         console.log(e);
//         return res.json(500).send({
//             success: false,
//             msg: errorResponse.StatusCode.SERVER_ERROR
//         })
//     }
// });
//
// const upload = multer({storage: storage}).single('product_file');
//
// router.post('/addProductFile', (req, res) => {
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json(err)
//         } else if (err) {
//             return res.status(500).json(err)
//         }
//         return res.status(200).send(req.file)
//     })
// });
//
//
// router.post('/deleteProduct', (req, res) => {
//     const productId = req.body.id;
//
//     try {
//         Product.findOne({_id: productId}, (err, user) => {
//             user['deleted_at'] = new Date();
//             user['status'] = 'blocked';
//             user.save();
//             return res.status(200).json({
//                 success: true,
//                 msg: errorResponse.StatusCode.SUCCESS_CODE
//             })
//         })
//
//     } catch (e) {
//         console.log(e)
//     }
// });
// //
// router.post('/getDeletedProductList', (req, res) => {
//     const status = req.body.status;
//     Product.find({status: status})
//         .then(product => {
//             return res.status(200).json({
//                 product
//             })
//         })
// });
//
// router.post('/productBlockToActive', (req, res) => {
//     const vendorId = req.body['id'];
//
//     try {
//         Product.findOne({_id: vendorId}, (err, user) => {
//             user['status'] = 'active';
//             user['updated_at'] = new Date();
//             user['deleted_at'] = null;
//             user.save();
//             return res.json({
//                 user
//             })
//         })
//     } catch (e) {
//         console.log(e)
//     }
// });
//
// router.post('/fileUpload', (req, res) => {
//     let token = req.headers['authorization'];
//     let decodedToken = jwt_decode(token);
//     const user_id = decodedToken['result']['_id'];
//
//     let readFile = req.body['file'];
//     let file = JSON.parse(readFile);
//     for (let item of file) {
//         const image = item['image'];
//         const title = item['title'];
//         const slug = item['slug'];
//         const description = item['description'];
//         const sku = item['sku'];
//         const regular_price = item['regular_price'];
//         const discount_price = item['discount_price'];
//         const quantity = item['quantity'];
//         const status = 'active';
//         const newProduct = new Product({
//             user_id,
//             title,
//             description,
//             slug,
//             sku,
//             regular_price,
//             discount_price,
//             quantity,
//             status,
//             image,
//         });
//         newProduct.save();
//     }
//     res.status(200).send({
//         success: true,
//         msg: errorResponse.StatusCode.SUCCESS_CODE
//     })
// });
module.exports = router;