// const jwt =require('jsonwebtoken');
// const catchAsync=require('../utils/catchAsync');
// const AppError=require('../utils/appError');
// const User=require('../models/userModel');
// const isAuthenticated=catchAsync(async(req,res,next)=>{
//     const token=req.cookies.token || req.headers.authorization?.split("")[1];
//     if(!token){
//         return next(new AppError("You are not logged in!! Please login ",401));

//     }
//     const decoded=jwt.verify(token,process.env.JWT_SECRET);
//     const currentUser=await User.findById(decoded.id);
//     if(!currentUser)
//         return next(new AppError("The user does not exist",401));
//     req.user=currentUser;
//     next();
    
// });
// module.exports=isAuthenticated;
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

const isAuthenticated = catchAsync(async (req, res, next) => {
    let token;
    
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);  // ✅ Corrected Typo

    if (!currentUser) {
        return next(new AppError("The user does not exist", 401));
    }

    req.user = currentUser;
    next();
});

module.exports = isAuthenticated;
