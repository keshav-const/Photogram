
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");
const { uploadToCloudinary, cloudinary } = require("../utils/cloudinary");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel"); // Ensure Comment model is imported

// ✅ Create Post
const createPost = catchAsync(async (req, res, next) => {
    console.log("📩 Received Data:", req.body); 
    try {
        console.log("Received file:", req.file);
        console.log("Received caption:", req.body.caption);

        if (!req.file) {
            return next(new AppError("Image is required for the post", 400));
        }

        const { caption } = req.body;
        const userId = req.user._id;

        // 🔥 Yaha problem ho sakti hai, isliye error handle kar
        let optimizedImageBuffer;
        try {
            optimizedImageBuffer = await sharp(req.file.path)
                .resize({ width: 800, height: 800, fit: "inside" })
                .toFormat("jpeg", { quality: 80 })
                .toBuffer();
        } catch (err) {
            console.error("Image processing error:", err);
            return next(new AppError("Image processing failed", 500));
        }

        // Convert to Base64
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        console.log("File URI for Cloudinary:", fileUri);

        // Upload to Cloudinary
        let cloudResponse;
        try {
            cloudResponse = await uploadToCloudinary(fileUri);
        } catch (err) {
            console.error("Cloudinary Upload Error:", err);
            return next(new AppError("Image upload failed", 500));
        }

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
            data: { post },
        });
    } catch (error) {
        console.error("Server Error in createPost:", error);
        return next(new AppError("Something went wrong!", 500));
    }
});


const getAllPost = catchAsync(async (req, res, next) => {
    const posts = await Post.find()
        .populate({
            path: "user",
            select: "username profilePicture bio",
        })
        .populate({
            path: "comments",
            populate: {
                path: "user",
                model: "User",  // ✅ Ensure user is fully populated
                select: "username profilePicture email",
            },
        })
        .sort({ createdAt: -1 })
        .select("caption image likes comments createdAt");

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

// // ✅ Like/Dislike Post
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
const deletePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // console.log("Deleting Post ID:", id);
    // console.log("Logged-in User ID:", userId);

    // ✅ Find Post & Populate `user`
    const post = await Post.findById(id).populate("user");  // 👈 Make sure it's `"user"`

   // console.log("Fetched Post:", post);

    if (!post) {
        return next(new AppError("Post not Found", 404));
    }

    // ✅ Ensure `post.user` exists
    if (!post.user) {
        return next(new AppError("Post has no associated user!", 500));
    }

    // ✅ Ensure user is authorized
    if (post.user._id.toString() !== userId.toString()) {
        return next(new AppError("You are not authorized to delete this post", 403));
    }

    // ✅ Remove post from user's posts array
    await User.updateOne({ _id: userId }, { $pull: { posts: id } });

    // ✅ Remove from savedPosts
    await User.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

    // ✅ Remove comments related to post
    await Comment.deleteMany({ post: id });

    // ✅ Remove image from Cloudinary
    if (post.image && post.image.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
    }

    // ✅ Delete post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Post deleted successfully",
    });
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
