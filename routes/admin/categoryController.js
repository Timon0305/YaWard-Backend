const express = require('express');

const messages = require('../../utils/errorResponse');

const router = express.Router();

const Category = require('../../models/categoryModel/Category');


router.post('/getCateName', (req, res, next) => {
   const name = req.body.cateName;
   try {
       Category.findOne({title: name})
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

router.post('/getCateSlug', (req, res, next) => {
    const cateSlug = req.body.cateSlug;
    try {
        Category.findOne({slug: cateSlug})
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

router.post('/addCategory', (req, res) => {
    const {title, slug, description, status} = req.body;

    try {
       const newCategory = new Category({
           title, slug, description, status
       });
       newCategory.save()
           .then(category => {
               req.flash('success_msg', 'Add Category');
               res.status(200).json({
                   success: true,
                   msg: messages.StatusCode.SUCCESS_CODE,
                   data: category
               })
           })
    } catch (e) {
        console.error(e.message)
    }
});

router.get("/getCategoryList", (req, res) => {
    Category.find()
        .then(category => {
            return res.status(200).json({
                category
            })
        })
        .catch(e => console.error(e.message))
});

router.post('/editCategory', (req, res) => {
    const {id, title, slug, description, status} = req.body;
    try {
        Category.findOne({_id: id}, (err, category) => {
            category['title'] = title;
            category['slug'] = slug;
            category['description'] = description;
            category['status'] = status;
            category['updated_at'] = new Date();
            category.save();
            return res.status(200).json({
                msg: messages.StatusCode.SUCCESS_CODE,
                success: true,
                category
            })
        })
    } catch (e) {
        console.error(e.message)
    }
});

router.post('/deleteCategory', (req, res) => {
    const id = req.body.id;
    try {
        Category.remove({_id: id}, (err, category) => {
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