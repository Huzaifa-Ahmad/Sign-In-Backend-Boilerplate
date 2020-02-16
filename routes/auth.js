const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { registerValidation, loginValidation } = require("../validation");

// Register
router.post("/register", async (req, res) => {
  // VALIDATING DATA PRE USER CREATION
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Hashing password
  const salt = await bcrypt.genSalt(10); // default is 10
  const hashedPassword = await bcrypt.hash(req.body.password, salt); // assigning hashedPassword

  // CREATING A NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ userID: user._id });
  } catch (e) {
    res.send(400).send(e);
  }
});

// Login

router.post("/login", async (req, res) => {
  // const jwtExpiration = "5h";

  // VALIDATING DATA PRE USER CREATION
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is invalid");

  // Checking is the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("password is invalid");

  // Creating & assigning token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // res.header("auth-token", token).send(token);

  res.status(200).send("Successfully Logged In!");
});

module.exports = router;
