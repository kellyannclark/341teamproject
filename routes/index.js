const router = require('express').Router();
const passport = require('passport');

router.use("/", require("./swagger"));

// router.get("/", (req, res) => {
//     //#swagger.tags = ["Hello World"]
//     res.send("Hello World");
// }); // GET request and responds with Hello World

router.use("/book", require("./book")); 
router.use("/bookStore", require("./bookStore"));
router.use("/users", require("./users"));
router.use("/payment",require("./payment"));

router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if(err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;








