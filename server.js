require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const pino = require('express-pino-logger')();
const cors = require('cors');

const app = express();

//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;


//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.log(err));

//BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// cors
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

// Express Session
app.use(session({
    secret: 'yaward',
    resave: true,
    saveUninitialized: true,
}));

// Connect flash
app.use(flash());

//Global Vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Password middleware
app.use(passport.initialize());
app.use(passport.session());

const {adminStatus} = require('./middleware/adminMiddleware/admin');
const {vendorStatus} = require('./middleware/vendorMiddleware/vendor');
const {customerStatus} = require('./middleware/customerMiddleware/customer');

// Admin Routes
app.use('/v1/api/admin/users', require('./routes/admin/adminController'));
app.use('/v1/api/admin/dashboard', adminStatus, require('./routes/admin/adminDashboard'));
app.use('/v1/api/admin/vendors',adminStatus , require('./routes/admin/vendorController'));
app.use('/v1/api/admin/customers', adminStatus, require('./routes/admin/customerController'));
app.use('/v1/api/admin/products', adminStatus, require('./routes/admin/productController'));
app.use('/v1/api/admin/category', adminStatus, require('./routes/admin/categoryController'));
app.use('/v1/api/admin/occasion', adminStatus, require('./routes/admin/occasionController'));
app.use('/v1/api/admin/tags', adminStatus, require('./routes/admin/tagsController'));
app.use('/v1/api/admin/orders', adminStatus, require('./routes/admin/orderContoller'));

// Vendor Routes
app.use('/v2/api/vendor/users', require('./routes/vendor/vendorController'));
app.use('/v2/api/vendor/dashboard',vendorStatus, require('./routes/vendor/dashboardController'));
app.use('/v2/api/vendor/settings', vendorStatus,  require('./routes/vendor/settingController'));
app.use('/v2/api/vendor/products', vendorStatus, require('./routes/vendor/productController'));


// Customer Routes
app.use('/v3/api/customer/users', require('./routes/customer/customerController'));
app.use('/v3/api/customer/shops', require('./routes/customer/shopController'));
app.use('/v3/api/customer/products', require('./routes/customer/productController'));
app.use('/v3/api/customer/profile', customerStatus, require('./routes/customer/profileController'));
app.use('/v3/api/customer/checkout', customerStatus, require('./routes/customer/checkoutController'));

//Add Vendor Image Showing
app.use('/public/vendorInfo/:cr_image', (req, res) => {
    const crImage = req.param('cr_image');
    res.sendFile(__dirname + '/public/vendorInfo/' +  crImage)
});

app.use('/public/vendorInfo/:vat_image', (req, res) => {
    const vatImage = req.param('vat_image');
    res.sendFile(__dirname + '/public/vendorInfo/' + vatImage)
});

// Product Image Showing
app.use('/public/products/:image', (req, res) => {
    const productImage = req.param('image');
    res.sendFile(__dirname + '/public/products/' + productImage)
});

app.use('/public/shopAvatar/:image', (req, res) => {
    const shopAvatar = req.param('image');
    res.sendFile(__dirname + '/public/shopAvatar/' + shopAvatar)
});

app.use('/public/occasion/:image', (req, res) => {
    const occasionImage  =  req.param('image');
    res.sendFile(__dirname + '/public/occasion/' + occasionImage)
});

app.use('/', (req, res) => {
    return res.json({
        msg: 'working'
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started at port ${PORT}`));
