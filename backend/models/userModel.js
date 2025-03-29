
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add Username"],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Please add email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Provide Password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please Confirm Password"],
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 150,
        default: "",
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null,
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
}, { timestamps: true });

// ✅ Hash Password Before Saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

// ✅ Method to Compare Passwords
userSchema.methods.correctPassword = async function (userPassword, databasePassword) {
    return await bcrypt.compare(userPassword, databasePassword);
};

// ✅ Model Export
const User = mongoose.model("User", userSchema);
//console.log("User Model Registered:", mongoose.models);

module.exports = User;
