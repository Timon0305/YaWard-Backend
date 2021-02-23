const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();

const Customer = require('../../models/customerModel/Customer');
const Occasion = require('../../models/occasionModel/Occasion');

router.get('/getAddress', (req, res) => {
    let token = req.headers['authorization'];
    let decodedToken = jwt_decode(token);
    const customer_id = decodedToken['result']['_id'];
    try {
        Customer.findOne({_id: customer_id}, (err, customer) => {
            return res.status(200).json({
                customer: customer
            })
        })
    } catch (e) {
        console.log(e)
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

module.exports = router;
