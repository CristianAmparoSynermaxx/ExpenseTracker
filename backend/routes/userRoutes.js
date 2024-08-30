const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
const {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  getMe,
} = require("../controller/userController");

router.post("/login", loginUser); // login user
router.get("/", getUsers); // See all the user
router.get("/:id", getMe); // See user data
router.post("/", upload.single("image"), registerUser); // Add user
router.put("/:id", upload.single("image"), updateUser); // Update an user
router.delete("/:id", deleteUser); // Delete an user

module.exports = router;
