var express = require('express');
var router = express.Router();

// GET 'demo1' page.
router.get('/demo1', function(req, res) {
    res.render("demo1");
});

module.exports = router;