const express = require('express');
const distance = require('google-distance-matrix');
const router = express.Router();

const errorResponse = require('../../utils/errorResponse');
const Shop = require('../../models/shopModel/Shop');
const Vendor = require('../../models/vendorModel/Vendor');
const Product = require('../../models/productModel/Product');
const Occasion = require('../../models/occasionModel/Occasion');

let getDistance = async (origins, destinations, mode) => {
    return new Promise(async (resolve, reject) => {
        let result = {
            success: false,
            data: null
        };
        try {
            distance.matrix(origins, destinations, mode, (err, distances) => {
                if (!err) {
                    result.success = true;
                    result.data = distances.rows[0].elements[0];
                    resolve(result)
                } else {
                    result.data = err;
                    resolve(result);
                }
            })
        } catch (e) {
            result.data = e.message;
            resolve(result);
        }
    })
};

router.post('/getShopList', async (req, res) => {
    const origins = req.body.origins;
    const mode = req.body.travelMode;
    const shopNum = req.body.shopNum;
    try {
        Shop.find()
            .then(async shop => {
                let result = [];
                const dataNum = shop.length;
                const shop9Num = shopNum <= dataNum ? shopNum : dataNum;
                for (let i = 0; i < shop9Num; i++) {
                    const shopVendor = shop[i]['id'];
                    let vendor = await Vendor.findOne({_id: shopVendor});

                    const destinations = [vendor['map']];
                    try {
                        let distanceRes = await getDistance(origins, destinations, mode);
                        if (distanceRes.success) {
                            result.push({
                                shop: shop[i],
                                vendor,
                                distances: distanceRes.data
                            });
                        }
                    } catch (ex1) {
                        console.log(ex1.message)
                    }

                    if (i === shop9Num - 1) {
                        return res.json({
                            shop: result
                        })
                    }
                }

            })
            .catch(err => console.log(err))
    } catch (e) {
        throw e
    }
});

router.get('/getOccasionList', (req, res) => {
    Occasion.find({status: 'active'})
        .then(async occasion => {
            let result = [];
            for (let item of occasion) {
                const title = item['title'];
                const id = item['_id'];
                const image = item['image'];
                await Product.find({occasionName: title}, (req, res) => {
                    result.push({
                        title: title,
                        id: id,
                        image: image,
                        number: res.length
                    })
                })
            }
            return res.json({
                occasion: result
            })
        })
});

router.post('/getFlowersByOccasion', (req, res) => {
    const title = req.body.title;
    Product.find({occasionName: title}, (err, flower) => {
        return res.json({
            flower: flower
        })
    })
});
module.exports = router;
