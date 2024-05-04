const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login.ejs');
});
router.get('/home', (req, res) => {
    res.render('home.ejs');
});





module.exports = router