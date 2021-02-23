const express = require('express');
const jwt_decode = require('jwt-decode');

const router= express.Router();

const Product = require('../../models/productModel/Product');

router.get('/getAllProduct', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const vendor_id = decodedToken['result']['_id'];
    Product.find({vendor_id: vendor_id})
        .then(product => {
            let productNum = 0;
            for (let item of product) {
                productNum += parseInt(item.quantity)
            }
            return res.status(200).json({
                data: productNum
            })
        })

});

module.exports = router;