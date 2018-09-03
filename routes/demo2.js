var express = require('express');
var router = express.Router();

// GET 'demo2' page.
router.get('/demo2', function(req, res) {
    res.render("demo2");
});

module.exports = router;