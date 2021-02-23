const express = require('express');

const messages = require('../../utils/errorResponse');
const multer = require('multer');
const router = express.Router();

const Occasion = require('../../models/occasionModel/Occasion');

router.post('/getOccasionName', (req, res, next) => {
    const name = req.body.occasionName;
    try {
        Occasion.findOne({title: name})
            .then(name => {
                if (name) {
                    return res.status(200).json({
                        success: false,
                        msg: messages.StatusCode.DUPLICATE_OCCASION
                    })
                } else {
                    return res.status(200).json({
                        success: true
                    })
                }
            })
    } catch (e) {
        console.error(e)
    }
});

router.post('/getOccasionSlug', (req, res, next) => {
    const occasionSlug = req.body.occasionSlug;
    try {
        Occasion.findOne({slug: occasionSlug})
            .then(slug => {
                if (slug) {
                    return res.status(200).json({
                        success: false,
                        msg: messages.StatusCode.DUPLICATE_SLUG
                    })
                } else {
                    return res.status(200).json({
                        success: true
                    })
                }
            })
    } catch (e) {
        console.error(e)
    }
});

router.post('/addOccasion', (req, res) => {
    const {title, slug, description, image, status} = req.body;
    try {
        const newOccasion = new Occasion({
            title, slug, description, image, status
        });
        newOccasion.image = image.slice(12);
        newOccasion.save()
            .then(occasion => {
                req.flash('success_msg', 'Add Category');
                res.status(200).json({
                    success: true,
                    msg: messages.StatusCode.SUCCESS_CODE,
                    data: occasion
                })
            })
    } catch (e) {
        console.error(e.message)
    }
});

let storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/occasion/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage}).single('occasion_file');


router.post('/addOccasionFile', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

router.get("/getOccasionList", (req, res) => {
    Occasion.find()
        .then(occasion => {
            return res.status(200).json({
                occasion
            })
        })
        .catch(e => console.error(e.message))
});

router.post('/editOccasion', (req, res) => {
    const {id, title, slug, description, image, status} = req.body;
    try {
        Occasion.findOne({_id: id}, (err, occasion) => {
            occasion['title'] = title;
            occasion['slug'] = slug;
            occasion['description'] = description;
            occasion['status'] = status;
            occasion['image'] = image === '' ? occasion['image'] : image.slice(12);
            occasion['updated_at'] = new Date();
            occasion.save();
            return res.status(200).json({
                msg: messages.StatusCode.SUCCESS_CODE,
                success: true,
                occasion
            })
        })
    } catch (e) {
        console.error(e.message)
    }
});

router.post('/deleteOccasion', (req, res) => {
    const id = req.body.id;
    try {
        Occasion.remove({_id: id}, (err, occasion) => {
            return res.status(200).json({
                msg: messages.StatusCode.SUCCESS_CODE,
                success: true
            })
        })
    } catch (e) {
        console.error(e.message)
    }
});

module.exports = router;