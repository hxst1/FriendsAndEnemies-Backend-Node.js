const express = require("express");
const multer = require("multer");
const {
  userLogin,
  userRegister,
  getAllUsers,
  getUser,
} = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

const upload = multer({ dest: "public/" });
const router = express.Router();

router.post("/login", userLogin);
router.post("/register", upload.single("image"), userRegister);
router.get("/allusers", auth, getAllUsers);
router.get("/user", auth, getUser);

module.exports = router;
