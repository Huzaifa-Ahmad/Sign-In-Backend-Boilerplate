const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.send(req.user);
  User.findByOne({ _id: req.user });
});

module.exports = router;
