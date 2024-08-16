var userRouter = require('./userRouter');

var router = {
    run: function(req, res) {
        userRouter.run(req, res);
    }
};

module.exports = router;
