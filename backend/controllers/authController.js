const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateOtp = require("../utils/generateOtp");
const jwt=require("jsonwebtoken");
const fs=require("fs");
const hbs=require("hbs");
const path = require("path");

const sendEmail = require("../utils/email");

const loadTemplate=(templateName,replacements)=>{
    const templatePath=path.join(__dirname,"../emailTemplate",templateName);
    const source=fs.readFileSync(templatePath,'utf-8');
    const template=hbs.compile(source);
    return template(replacements);

};
const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{ 
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken=(user,statusCode,res,message)=>{
    const token=signToken(user._id);
    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"Lax",
    };
    res.cookie("token",token,cookieOptions);
    user.password=undefined;
    user.otp=undefined;
    res.status(statusCode).json({
        status:"success",
        message,
        token,
        data:{
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    //console.log("Signup route hit"); // ✅ Debugging log 1
    console.log("Request Body: ", req.body); // ✅ Debugging log 2

    const { username, email, password, passwordConfirm } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("Existing User: ", existingUser); // ✅ Debugging log 3

    if (existingUser) {
        console.log("User already exists, sending error");
        return next(new AppError("Email already registered", 400));
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    //console.log("Creating new user..."); // ✅ Debugging log 4
    const newUser = await User.create({
        username,
        email,
        password,
        passwordConfirm,
        otp,
        otpExpires,
    });

    // console.log("User created successfully:", newUser); // ✅ Debugging log 5

    // res.status(200).json({
    //     status: "success",
    //     message: "User signed up successfully",
    //     data: {
    //         user: newUser,
    //     },
    // });
    
    const htmlTemplate=loadTemplate('otpTemplate.hbs',{
        title:'Otp Verification',
        username:newUser.username,
        otp,
        message:"Your one time password (OTP) for account verification is:",

    });
    try{
        await sendEmail({
            email:newUser.email,
            subject:"OTP for email verification",
            html: htmlTemplate,
        });
        createSendToken(newUser,200,res,"Registration Successful.Check email for OTP");
    }catch(error){
        await User.findByIdAndDelete(newUser.id);
        
        return next(new AppError("there is error while creating the account.Please Try Again",500));
    }

  //console.log("Response sent successfully!"); // ✅ Debugging log 6
});


exports.verifyAccount = catchAsync(async (req, res, next) => {
    console.log("Received OTP for verification:", req.body.otp); // ✅ Debugging log
    console.log("Authenticated User:", req.user); // ✅ Debugging log

    const { otp } = req.body;
    if (!otp) {
        return next(new AppError("OTP is required for verification", 400));
    }

    const user = req.user;
    if (!user) {
        return next(new AppError("User not found. Please log in again.", 401));
    }

    if (user.otp !== otp) {
        return next(new AppError("Invalid OTP", 400));
    }

    if (Date.now() > user.otpExpires) {
        return next(new AppError("OTP has expired. Please request a new OTP", 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, "Email has been verified");
});

exports.resendOtp=catchAsync(async(req,res,next)=>{
    const { email }=req.user;
    if(!email){
        return next(new AppError("Email is required"),400)
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new AppError("User not found",404));
    }
    if(user.isVerified){
        return next(new AppError("This account is Verified",400));
    }
    const otp=generateOtp();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.otp=otp;
    user.otpExpires=otpExpires;

    await user.save({validateBeforeSave: false});
    const htmlTemplate=loadTemplate('otpTemplate.hbs',{
        title:'Otp Verification',
        username:user.username,
        otp,
        message:"Your one time password (OTP) for account verification is:",

    });
    try{
        await sendEmail({
            email:user.email,
            subject:"Resend OTP for email verification",
            html:htmlTemplate,
        });
        res.status(200).json({
            status:"success",
            message:"A new OTP has been sent to your email",
        });
        
    }catch(error){
         user.otp=undefined;
         user.otpExpires=undefined;
         await user.save({validateBeforeSave:false});
        return next(new AppError("There is an error,try again later!!",500));  
    }
});

exports.login=catchAsync(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email || !password){
       return next(new AppError("Please Provide correct email and password",400)); 
    }
    const user=await User.findOne({email}).select("+password");
    if(!user ||!(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));
    }
    createSendToken(user,200,res,"Login Successful");
});
exports.logout=catchAsync(async(req,res,next)=>{
    res.cookie("token","logged out",{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
    });
    res.status(200).json({
        status:"success",
        message:"Logged Our Successfully",
    });
});

exports.forgetPassword=catchAsync(async(req,res,next)=>{
    const{email}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return next(new AppError("No User Found",404))
    }
    const otp=generateOtp();
    const resetExpires=Date.now()+300000;
    user.resetPasswordOTP=otp;
    user.resetPasswordOTPExpires=resetExpires;

    await user.save({validateBeforeSave:false});
    const  htmlTemplate=loadTemplate("otpTemplate.hbs",{
        title:"Reset Password Otp",
        username:user.username,
        otp,
        message:"Your Password Reset Otp is:",
    });

    try{
    await sendEmail({
        email:user.email,
        subject:"Password Reset OTP(valid for 5 minutes)",
        html:htmlTemplate
        });
        res.status(200).json({
            status:"Success",
            message:"Password Reset OTP sent",
        });
    }catch(error){
        user.resetPasswordOTP=undefined;
        user.resetPasswordOTPExpires=undefined;
        await user.save({validateBeforeSave:false});
        return next(new AppError("There was an error sending the mail. Try Again Later",500));
    }

});

exports.resetPassword=catchAsync(async(req,res,next)=>{
    const {email,otp,password,passwordConfirm}=req.body;
    const user=await User.findOne({email,resetPasswordOTP:otp,resetPasswordOTPExpires:{$gt:Date.now()}});
    if(!user){
        return next(new AppError("No user Found.Please Try Again later!",400));

    }
    user.password=password;
    user.passwordConfirm=passwordConfirm;
    user.resetPasswordOTP=undefined;
    user.resetPasswordOTPExpires=undefined;
    await user.save();
    createSendToken(user,200,res,'Password Reset Successfull!');

});

exports.changePassword=catchAsync(async(req,res,next)=>{
    const {currentPassword,newPassword,newPasswordConfirm}=req.body;
    const {email}=req.user;
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new AppError("uSER Not found",400));

    }
    if(!(await user.correctPassword(currentPassword,user.password))){
        return next(new AppError("Incorrect Current Password",400));

    }
    if(newPassword!==newPasswordConfirm){
        return next(new AppError("Password doesn't match",400));
    }
    user.password=newPassword;
    user.passwordConfirm=newPasswordConfirm;
    await user.save();
    createSendToken(user,200,res,"Password Changed Successfully!!");
    
});