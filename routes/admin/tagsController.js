const express = require('express');

const messages = require('../../utils/errorResponse');

const router = express.Router();

const Tags = require('../../models/tagsModel/Tags');


router.post('/getTagsName', (req, res, next) => {
    const name = req.body.tagsName;
    try {
        Tags.findOne({title: name})
            .then(name => {
                if (name) {
                    return res.status(200).json({
                        success: false,
                        msg: messages.StatusCode.DUPLICATE_CATEGORY
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

router.post('/getTagsSlug', (req, res, next) => {
    const tagsSlug = req.body.tagsSlug;
    try {
        Tags.findOne({slug: tagsSlug})
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

router.post('/addTags', (req, res) => {
    const {title, slug, description, status} = req.body;

    try {
        const newTags = new Tags({
            title, slug, description, status
        });
        newTags.save()
            .then(tags => {
                req.flash('success_msg', 'Add Tags');
                res.status(200).json({
                    success: true,
                    msg: messages.StatusCode.SUCCESS_CODE,
                    data: tags
                })
            })
    } catch (e) {
        console.error(e.message)
    }
});

router.get("/getTagsList", (req, res) => {
    Tags.find()
        .then(tags => {
            return res.status(200).json({
                tags
            })
        })
        .catch(e => console.error(e.message))
});

router.post('/editTags', (req, res) => {
    const {id, title, slug, description, status} = req.body;
    try {
        Tags.findOne({_id: id}, (err, tags) => {
            tags['title'] = title;
            tags['slug'] = slug;
            tags['description'] = description;
            tags['status'] = status;
            tags['updated_at'] = new Date();
            tags.save();
            return res.status(200).json({
                msg: messages.StatusCode.SUCCESS_CODE,
                success: true,
                tags
            })
        })
    } catch (e) {
        console.error(e.message)
    }
});

router.post('/deleteTags', (req, res) => {
    const id = req.body.id;
    try {
        Tags.remove({_id: id}, (err, tags) => {
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