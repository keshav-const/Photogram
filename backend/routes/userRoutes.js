const express = require('express');
const { signup, verifyAccount, resendOtp, login, logout, forgetPassword, resetPassword, changePassword } = require('../controllers/authController'); 
const isAuthenticated  = require("../middleware/isAuthenticated");
const { getProfile, editProfile, suggestedUser, followUnfollow, getMe } = require('../controllers/userController');
const upload = require('../middleware/multer');

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", isAuthenticated, verifyAccount);  
router.post("/resend-otp",isAuthenticated,resendOtp);
router.post("/login",login);
router.post("/logout",logout);
router.post("/forgetPassword",forgetPassword);
router.post("/resetpassword",resetPassword);
router.post("/changepassword",isAuthenticated,changePassword);

router.get('/profile/:id',getProfile);
router.post("/editprofile",isAuthenticated,upload.single("profilePicture"),editProfile);
router.get("/suggestedUsers",isAuthenticated,suggestedUser);
router.post("/follow-Unfollow/:id",isAuthenticated,followUnfollow);
router.get("/getMe",isAuthenticated,getMe);
module.exports = router;
