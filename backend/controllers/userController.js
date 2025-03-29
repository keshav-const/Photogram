const catchAsync = require("../utils/catchAsync");
const User=require("../models/userModel");
const AppError = require("../utils/appError");
const getDataUri = require("../utils/datauri");
const { uploadToCloudinary } = require("../utils/cloudinary");
exports.getProfile=catchAsync(async(req,res,next)=>{
    let { id } = req.params;
    id = id.trim();
    const user=await User.findById(id).select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm").
    populate({
        path:'posts',
        options:{sort:{createdAt: -1}},
    }).populate({
        path:"savedPosts",
        options:{sort:{createdAt: -1}},
    });
    if(!user){
        return next(new AppError("User Not Found",404));

    }
    res.status(200).json({
        status:"success",
        data:{
            user
        },
    });
});

exports.editProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id; // ✅ Correct: Get user from `req.user`
    const { bio } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    // console.log("Received User ID:", userId); // Debugging
    // console.log("Request Body:", req.body);
    // console.log("Uploaded File:", profilePicture);

    if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        cloudResponse = await uploadToCloudinary(fileUri);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
        return next(new AppError("User Not Found", 404));
    }

    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
        status: 'success',
        message: "Profile Updated",
        data: { user },
    });
});



exports.suggestedUser=catchAsync(async(req,res,next)=>{
    const loginUserId=req.user.id;
    const users=await User.find({_id:{$ne:loginUserId}}).select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm");

    res.status(200).json({
        status:"success",
        data:{
            users,
        },
    });

})

exports.followUnfollow=catchAsync(async(req,res,next)=>{
    const loginUserId=req.user._id;
    const targetUserId=req.params.id;

    if(loginUserId.toString()===targetUserId){
        return next(new AppError("You cannot follow Yourself",400));
    }
    const targetUser=await User.findById(targetUserId);
    if(!targetUser){
        return next(new AppError("User Not Found",404));

    }

    const isFollowing=targetUser.followers.includes(loginUserId);
    if(isFollowing){
        await Promise.all([
            User.updateOne({_id:loginUserId},{$pull:{following:targetUserId}}),
            User.updateOne({_id:targetUser},{$pull:{followers:loginUserId}}),
        ]);
    }
    else{
        await Promise.all([
            User.updateOne(
                {_id:loginUserId},
                {$addToSet:{following:targetUserId}}
            ),
            User.updateOne(
                {_id:targetUserId},
                {$addToSet:{followers:loginUserId}}
            ),

        ]);
    }

    const updatedLoggedInUser=await User.findById(loginUserId).select("-password");
    res.status(200).json({
        message:isFollowing ?'Unfollowed Successfully':'Followed Successfully',
        status:'success',
        data:{
            user:updatedLoggedInUser,
        },
    });
});

exports.getMe=catchAsync(async(req,res,next)=>{
    const user=req.user;
    if(!user) return next(new AppError("User Not Found",404));
    res.status(200).json({
        status:'success',
        message:'Authenticated User',
        data:{
            user,
        },
    });
});

