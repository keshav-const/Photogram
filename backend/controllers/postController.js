// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const sharp=require("sharp");
// const { uploadToCloudinary, cloudinary } = require("../utils/cloudinary");
// const Post = require("../models/postModel");
// const User = require("../models/userModel");
// exports.createPost=catchAsync(async (req,res,next)=>{
//     const {caption}=req.body;
//     const image=req.file;
//     const userId=req.user._id;
//     if(!image){
//         return next(new AppError('Image is Required for the Post',400));
//     }
//     //optimize the image

//     const optimizedImageBuffer=await sharp(image.buffer).resize({widht:800,height:800,
//         fit:"inside",    
//     }).toFormat("jpeg",{quality:80}).toBuffer();
//     const fileUri=`data:image/jpeg;base64, ${optimizedImageBuffer.toString("base64")}`;
//     const cloudResponse=await uploadToCloudinary(fileUri);
//     let post=await Post.create({
//         caption,
//         image:{
//             url:cloudResponse.secure_url,
//             publicId:cloudResponse.public_id,
//         },
//         user:userId,
//     });
//     const user=await User.findById(userId);
//     if(user){
//         user.posts.push(post.id);
//         await user.save({validateBeforeSave:false});
//     }
//     post=await post.populate({
//         path:'user',
//         select:"username email bio profilePicture",
//     });
//     return res.status(201).json({
//         status:"Success",
//         message:"Post Created",
//         data:{
//             post,
//         },
//     });

// });

// exports.getAllPost=catchAsync(async(req,res,next)=>{
//     const posts=await Post.find().populate({
//         path:'user',
//         select:"username profilePicture bio"
//     }).populate({
//         path:'comments',
//         select:'text user',
//         populate:{
//             path:'user',
//             select:"username profilePicture",
//         },
//     }).sort({createdAt:- 1});
//     return res.status(200).json({
//         status:'success',
//         results:posts.length,
//         data:{
//             posts
//         },

//     });
// });

// exports.getUserposts=catchAsync(async(req,res,next)=>{
//   const userId=req.params.id;
//   const posts=await Post.find({user:userId}).populate({
//     path:'comments',
//         select:'text user',
//         populate:{
//             path:'user',
//             select:"username profilePicture",
//         },
//   }).sort({createdAt: -1});
//   return res.status(200).json({
//     status:'success',
//     results:posts.length,
//     data:{
//         posts
//     },
//   });
// });


// exports.saveOrUnsavePost=catchAsync(async(req,res,next)=>{
//     const userId=req.user._id;
//     const postId=req.params.postId;
//     const user=await User.findById(userId);
//     if(!user) return next(new AppError("User Not Found!",404));
    
//     const isPostSave=user.savedPosts.includes(postId);
//     if(isPostSave){
//         user.savedPosts.pull(postId);
//         await user.save({validateBeforeSave:false});
//         return res.status(200).json({
//             status:"success",
//             message:"Post Unsaved successfully",
//             data:{
//                 user,
//             },
//         });

//     }else{
//         user.savedPosts.push(postId);
//         await user.save({validateBeforeSave:false});
//         return res.status(200).json({
//             status:"success",
//             message:"Post Saved successfully",
//             data:{
//                 user,
//             },
//         });
//     }
// });

// exports.deletePost=catchAsync(async(req,res,next)=>{
//     const {id}=req.params;
//     const userId=req.user._id;
//     const post=await Post.findById(id).populate("user");
//     if(!post){
//         return next(new AppError("Post noot Found",404));
//     }
//     if(post.user._id.toString()!==userId.toString()){
//         return next(new AppError("You are not authorized to delete this post",403));

//     }
//     //remove the post from user posts
//     await User.updateOne({_id:userId},{$pull:{posts:id}});
//     //remove the post from all the users who have saved it
//     await User.updateMany({savedPosts:id},{$pull:{savedPosts:id}});
//     //remove the comments of this post
//     await Comment.deleteMany({post:id});
//     //remove image from cloudinary 
//     if(post.image.publicId){
//         await cloudinary.uploader.destroy(post.image.publicId);
//     }
//     //now remove the post
//     await Post.findByIdAndDelete(id);
//     res.status(200).json({
//         status:"success",
//         message:"Post deleted Successfully",
//     });
// });

// exports.likeOrDislikePost=catchAsync(async(req,res,next)=>{
//     const {id}=req.params;
//     const userId=req.user._id;
//     const post=await post.findById(id);
//     if(!post) return next(new AppError("Post not found",404));

//     const isLiked=post.likes.includes(userId);
//     if(isLiked){
//         await Post.findByIdAndUpdate(id,{$pull:{likes:userId}},{new : true});
//         return res.status(200).json({
//             status:"success",
//             message:"Post Unliked Successfully",
//         });
//     }else{
//         await Post.findByIdAndUpdate(id,{$addToSet:{likes: userId}},
//             {new:true}
//         );
//         return res.status(200).json({
//             status:"success",
//             message:"Post Liked Successfully",
//         });
//     }
// });

// exports.addComment=catchAsync(async(req,res,next)=>{
//     const{id:postid}=req.params;
//     const userId=req.user._id;
//     const {text}=req.body;
//     const post=await Post.findById(postId);
//     if(!post) return next(new AppError("Post not found",404));
//      if(!text) return next(new AppError("Text Not Found",404));
//      const comment=await Comment.create({
//         text,
//         user:userId,
//         createdAt:Date.now(),
//      });
//      post.comments.push(comment);
//      await post.save({validateBeforeSave:false});
//      await comment.popoulate({
//        path:"user",
//        select:"username profilePicture bio", 
//      });
//      res.status(200).json({
//         status:"success",
//         message:"comment added successfully",
//         data:{
//             comment,
//         },
//      })
// });

// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const sharp = require("sharp");
// const { uploadToCloudinary, cloudinary } = require("../utils/cloudinary");
// const Post = require("../models/postModel");
// const User = require("../models/userModel");

// console.log("User Model Import Check:", User);


// ✅ Create Post
// const createPost = catchAsync(async (req, res, next) => {
//     console.log("Received File:", req.file); // Debugging log

//     const { caption } = req.body;
//     const image = req.file;
//     const userId = req.user._id;

//     if (!image) {
//         return next(new AppError("Image is required for the post", 400));
//     }

//     // Optimize image
//     const optimizedImageBuffer = await sharp(image.buffer)
//         .resize({ width: 800, height: 800, fit: "inside" })
//         .toFormat("jpeg", { quality: 80 })
//         .toBuffer();

//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    
//     console.log("Uploading Image to Cloudinary...");
//     const cloudResponse = await uploadToCloudinary(fileUri);
//     console.log("Cloudinary Response:", cloudResponse);

//     let post = await Post.create({
//         caption,
//         image: {
//             url: cloudResponse.secure_url,
//             publicId: cloudResponse.public_id,
//         },
//         user: userId,
//     });

//     const user = await User.findById(userId);
//     if (user) {
//         user.posts.push(post.id);
//         await user.save({ validateBeforeSave: false });
//     }

//     post = await post.populate({
//         path: "user",
//         select: "username email bio profilePicture",
//     });
    
//     console.log("Post ID:", post.id);  // ✅ Debugging
//     console.log("Post User:", post.user);  // ✅ Debugging
    


//     return res.status(201).json({
//         status: "success",
//         message: "Post Created",
//         data: {
//             post,
//         },
//     });
// });
//const uploadToCloudinary = require("../utils/cloudinary");

// const Post = require("../models/postModel");
// const { uploadToCloudinary } = require("../utils/cloudinary");

// const fs = require("fs");

// const path = require('path');

// function saveBase64Image(base64String, filePath) {
//     const matches = base64String.match(/^data:(.+);base64,(.+)$/);
//     if (!matches || matches.length !== 3) {
//         throw new Error('Invalid base64 string');
//     }
    
//     const buffer = Buffer.from(matches[2], 'base64');

//     fs.writeFileSync(filePath, buffer);
//     console.log('Image saved:', filePath);
// }


// // const createPost = async (req, res) => {
// //     try {
// //         console.log("Request Body:", req.body);  // Debugging
// //         console.log("Uploaded File:", req.file); // Debugging
// //         console.log("User:", req.user); // Debugging

// //         if (!req.user || !req.user._id) {
// //             return res.status(401).json({ error: "User not authenticated" });
// //         }

// //         if (!req.file) {
// //             return res.status(400).json({ error: "Image file is required" });
// //         }

// //         const fileBuffer = fs.readFileSync(req.file.path); // Read file
// //         const fileUri = `data:image/png;base64,${fileBuffer.toString("base64")}`;
// //         const uploadResponse = await uploadToCloudinary(fileUri);

// //         const newPost = await Post.create({
// //             caption: req.body.caption,
// //             user: req.user._id,
// //             image: {
// //                 url: uploadResponse.secure_url,
// //                 publicId: uploadResponse.public_id,
// //             },
// //         });

// //         res.status(201).json({ success: true, post: newPost });
// //     } catch (error) {
// //         console.error("Error Creating Post:", error);
// //         res.status(500).json({ error: error.message });
// //     }
// // };


// const exports.createPost = async (req, res) => {
//     try {
//         console.log("Request Body:", req.body);  // 👈 Debugging ke liye

//         const { image, caption } = req.body;

//         if (!image) {
//             return res.status(400).json({ message: "Image is required" });
//         }

//         const fileName = `post_${Date.now()}.jpg`;
//         const filePath = path.join(__dirname, '../uploads/', fileName);

//         // Save base64 image as a file
//         saveBase64Image(image, filePath);

//         // Save post in DB
//         const newPost = new Post({
//             image: `/uploads/${fileName}`,
//             caption
//         });
//         await newPost.save();

//         res.status(201).json({ message: "Post created successfully", post: newPost });
//     } catch (error) {
//         console.error(error);  // 👈 Error ko console me dikhane ke liye
//         res.status(500).json({ message: error.message });
//     }
// };



// // ✅ Get All Posts
// const getAllPost = catchAsync(async (req, res, next) => {
//     const posts = await Post.find()
//         .populate({
//             path: "user",
//             select: "username profilePicture bio",
//         })
//         .populate({
//             path: "comments",
//             select: "text user",
//             populate: {
//                 path: "user",
//                 select: "username profilePicture",
//             },
//         })
//         .sort({ createdAt: -1 });

//     return res.status(200).json({
//         status: "success",
//         results: posts.length,
//         data: {
//             posts,
//         },
//     });
// });

// // ✅ Get User Posts
// const getUserposts = catchAsync(async (req, res, next) => {
//     const userId = req.params.id;
//     const posts = await Post.find({ user: userId })
//         .populate({
//             path: "comments",
//             select: "text user",
//             populate: {
//                 path: "user",
//                 select: "username profilePicture",
//             },
//         })
//         .sort({ createdAt: -1 });

//     return res.status(200).json({
//         status: "success",
//         results: posts.length,
//         data: {
//             posts,
//         },
//     });
// });

// // ✅ Save/Unsave Post
// const saveOrUnsavePost = catchAsync(async (req, res, next) => {
//     const userId = req.user._id;
//     const postId = req.params.postId;
//     const user = await User.findById(userId);
//     if (!user) return next(new AppError("User Not Found!", 404));

//     const isPostSaved = user.savedPosts.includes(postId);
//     if (isPostSaved) {
//         user.savedPosts.pull(postId);
//         await user.save({ validateBeforeSave: false });
//         return res.status(200).json({
//             status: "success",
//             message: "Post Unsaved successfully",
//         });
//     } else {
//         user.savedPosts.push(postId);
//         await user.save({ validateBeforeSave: false });
//         return res.status(200).json({
//             status: "success",
//             message: "Post Saved successfully",
//         });
//     }
// });

// // ✅ Delete Post
// const deletePost = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const userId = req.user._id;
//     const post = await Post.findById(id).populate("user");
//     if (!post) {
//         return next(new AppError("Post not Found", 404));
//     }
//     if (post.user._id.toString() !== userId.toString()) {
//         return next(new AppError("You are not authorized to delete this post", 403));
//     }

//     await User.updateOne({ _id: userId }, { $pull: { posts: id } });
//     await User.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

//     if (post.image.publicId) {
//         await cloudinary.uploader.destroy(post.image.publicId);
//     }

//     await Post.findByIdAndDelete(id);
//     res.status(200).json({
//         status: "success",
//         message: "Post deleted Successfully",
//     });
// });

// // ✅ Like/Dislike Post
// const likeOrDislikePost = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const userId = req.user._id;
//     const post = await Post.findById(id);
//     if (!post) return next(new AppError("Post not found", 404));

//     const isLiked = post.likes.includes(userId);
//     if (isLiked) {
//         await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });
//         return res.status(200).json({
//             status: "success",
//             message: "Post Unliked Successfully",
//         });
//     } else {
//         await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true });
//         return res.status(200).json({
//             status: "success",
//             message: "Post Liked Successfully",
//         });
//     }
// });

// // ✅ Add Comment
// const addComment = catchAsync(async (req, res, next) => {
//     const { id: postId } = req.params;
//     const userId = req.user._id;
//     const { text } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) return next(new AppError("Post not found", 404));
//     if (!text) return next(new AppError("Text Not Found", 400));

//     const comment = await Comment.create({
//         text,
//         user: userId,
//         createdAt: Date.now(),
//     });

//     post.comments.push(comment);
//     await post.save({ validateBeforeSave: false });

//     await comment.populate({
//         path: "user",
//         select: "username profilePicture bio",
//     });

//     res.status(200).json({
//         status: "success",
//         message: "Comment added successfully",
//         data: {
//             comment,
//         },
//     });
// });

// // ✅ Export all functions
// module.exports = {
//     createPost,
//     getAllPost,
//     getUserposts,
//     saveOrUnsavePost,
//     deletePost,
//     likeOrDislikePost,
//     addComment,
// };

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");
const { uploadToCloudinary, cloudinary } = require("../utils/cloudinary");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel"); // Ensure Comment model is imported

// ✅ Create Post
const createPost = catchAsync(async (req, res, next) => {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.user._id;

    if (!image) {
        return next(new AppError("Image is required for the post", 400));
    }

    // Optimize image
    const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

    const cloudResponse = await uploadToCloudinary(fileUri);

    let post = await Post.create({
        caption,
        image: {
            url: cloudResponse.secure_url,
            publicId: cloudResponse.public_id,
        },
        user: userId,
    });

    const user = await User.findById(userId);
    if (user) {
        user.posts.push(post.id);
        await user.save({ validateBeforeSave: false });
    }

    post = await post.populate({
        path: "user",
        select: "username email bio profilePicture",
    });

    return res.status(201).json({
        status: "success",
        message: "Post Created",
        data: {
            post,
        },
    });
});

// ✅ Get All Posts
const getAllPost = catchAsync(async (req, res, next) => {
    const posts = await Post.find()
        .populate({
            path: "user",
            select: "username profilePicture bio",
        })
        .populate({
            path: "comments",
            select: "text user",
            populate: {
                path: "user",
                select: "username profilePicture",
            },
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        status: "success",
        results: posts.length,
        data: {
            posts,
        },
    });
});

// ✅ Get User Posts
const getUserposts = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId })
        .populate({
            path: "comments",
            select: "text user",
            populate: {
                path: "user",
                select: "username profilePicture",
            },
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        status: "success",
        results: posts.length,
        data: {
            posts,
        },
    });
});

// ✅ Save/Unsave Post
const saveOrUnsavePost = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User Not Found!", 404));

    const isPostSaved = user.savedPosts.includes(postId);
    if (isPostSaved) {
        user.savedPosts.pull(postId);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status: "success",
            message: "Post Unsaved successfully",
        });
    } else {
        user.savedPosts.push(postId);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status: "success",
            message: "Post Saved successfully",
        });
    }
});

// ✅ Delete Post
const deletePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id).populate("user");

    if (!post) {
        return next(new AppError("Post not Found", 404));
    }
    if (post.user._id.toString() !== userId.toString()) {
        return next(new AppError("You are not authorized to delete this post", 403));
    }

    // Remove post from user's posts array
    await User.updateOne({ _id: userId }, { $pull: { posts: id } });

    // Remove post from all users who have saved it
    await User.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

    // Remove comments associated with this post
    await Comment.deleteMany({ post: id });

    // Remove image from cloudinary
    if (post.image.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
    }

    // Delete post from database
    await Post.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Post deleted Successfully",
    });
});

// ✅ Like/Dislike Post
const likeOrDislikePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) return next(new AppError("Post not found", 404));

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
        await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });
        return res.status(200).json({
            status: "success",
            message: "Post Unliked Successfully",
        });
    } else {
        await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true });
        return res.status(200).json({
            status: "success",
            message: "Post Liked Successfully",
        });
    }
});

// ✅ Add Comment
const addComment = catchAsync(async (req, res, next) => {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) return next(new AppError("Comment text is required", 400));

    const post = await Post.findById(postId);
    if (!post) return next(new AppError("Post not found", 404));

    const comment = await Comment.create({
        text,
        user: userId,
        post: postId,
        createdAt: Date.now(),
    });

    post.comments.push(comment._id);
    await post.save({ validateBeforeSave: false });

    await comment.populate({
        path: "user",
        select: "username profilePicture bio",
    });

    res.status(201).json({
        status: "success",
        message: "Comment added successfully",
        data: {
            comment,
        },
    });
});

// ✅ Export all functions
module.exports = {
    createPost,
    getAllPost,
    getUserposts,
    saveOrUnsavePost,
    deletePost,
    likeOrDislikePost,
    addComment,
};
