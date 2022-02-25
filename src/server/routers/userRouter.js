const express = require("express");
const { userLogin } = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", userLogin);

module.exports = router;
