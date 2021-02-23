const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const OrderSchema = require('../../models/orderModel/Order');
const ProductSchema = require('../../models/productModel/Product');
const VendorSchema = require('../../models/adminModel/Admin');
const UserSchema = require('../../models/userModel/User');

router.get('/getAddProduct', (req, res) => {
    console.log('asd')
});

module.exports = router;
