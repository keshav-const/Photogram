// const express=require("express");
// const isAuthenticated = require("../middleware/isAuthenticated");
// const upload = require("../middleware/multer");
// const { createPost, getAllPost, getUserposts, saveOrUnsavePost, deletePost, likeOrDislikePost, addComment } = require("../controllers/postController");

// const router=express.Router();

// router.post("/createPost",isAuthenticated,upload.single('image'),createPost);

// router.get("/all",getAllPost);
// router.get("/userpost/:id",getUserposts);
// router.post("/saveunsavepost/:postId",isAuthenticated,saveOrUnsavePost);
// router.delete("/deletepost/:id",isAuthenticated,deletePost);
// router.post("/likeunlike/:id",isAuthenticated,likeOrDislikePost);
// router.post("/comment/:id",isAuthenticated,addComment);
// module.exports=router;
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");

const {
    createPost,
    getAllPost,
    getUserposts,
    saveOrUnsavePost,
    deletePost,
    likeOrDislikePost,
    addComment
} = require("../controllers/postController");

console.log("Post Controller Functions:", {
    createPost,
    getAllPost,
    getUserposts,
    saveOrUnsavePost,
    deletePost,
    likeOrDislikePost,
    addComment
});

const router = express.Router();

router.post("/createPost", isAuthenticated, upload.single("image"), createPost);
router.get("/all", getAllPost);
router.get("/userpost/:id", getUserposts);
router.post("/saveunsavepost/:postId", isAuthenticated, saveOrUnsavePost);
router.delete("/deletepost/:id", isAuthenticated, deletePost);
router.post("/likeunlike/:id", isAuthenticated, likeOrDislikePost);
router.post("/comment/:id", isAuthenticated, addComment);

module.exports = router;
