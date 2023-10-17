const express = require("express");
const { userRegistration, userLogin } = require("../controllers/user.js");

const router = express.Router();

router.post("/", userRegistration);
router.post("/login", userLogin);

module.exports = router;