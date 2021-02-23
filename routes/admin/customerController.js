const express = require('express');
const {genSaltSync, hashSync} = require('bcryptjs');

const errorResponse = require('../../utils/errorResponse');
const router = express.Router();
const multer = require('multer');

const Customer = require('../../models/customerModel/Customer');

router.get('/getAllCustomer', (req, res) => {
    const deleted_at = null;
    Customer.find({deleted_at: deleted_at})
        .then(customer => {
            return res.status(200).json({
                customer
            })
        })
});

router.post('/editCustomer', (req, res) => {
    const customerId = req.body.id;
    const status = req.body.status;
    Customer.findOne({_id: customerId}, (err, customer) => {
        customer.status = status === 'pending' ? 'active' : 'pending';
        customer.updated_at = new Date();
        customer.save();
        Customer.find()
            .then(customer => {
                return res.status(200).json({
                    customer
                })
            })
    })
});

router.post('/getDeletedCustomerList', (req, res) => {
    const status = req.body.status;
    Customer.find({status: status})
        .then(customer => {
            return res.status(200).json({
                customer
            })
        })
        .catch(e => console.log(e))
});

router.post('/deleteCustomer', (req, res) => {
    const customerId = req.body.id;

    try {
        Customer.findOne({_id: customerId}, (err, user) => {
            user['status'] = 'blocked';
            user['created_at'] = null;
            user['deleted_at'] = new Date();
            user.save();
            return res.json({
                success: true
            })
        })
    } catch (e) {
        console.log(e)
    }
});
module.exports = router;