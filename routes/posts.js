const router=require("express").Router();
const Post= require("../models/Post")
const User=require("../models/User")

//create a post
router.post("/", async(req,res)=>{
    const newPost=new Post(req.body);
    try{
        const savedPost= await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id",async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("post is updated");
        }else{
            res.status(403).json("You can only update you post")
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//delete a post
router.delete("/:id",async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            res.status(200).json("post has been deleted");
        }else{
            res.status(403).json("You can only delete you post")
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//like or dislike a post
router.put("/:id/like",async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes:req.body.userId}});
            res.status(200).json("Post has been liked!!(●'◡'●)");
        }else{
            await post.updateOne({$pull: {likes:req.body.userId}});
            res.status(200).json("Post has been disliked!!(•_•)");
        }
    }catch(err){
        res.status(500).json(err);
    }
})

//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });

// router.get("/timeline/all", async (req, res) => {
//     try {
//         const userId = req.body.userId; // Get userId from query parameters
//         if (!userId) {
//             return res.status(400).json({ error: "User ID is required" });
//         }

//         const currentUser = await User.findById(userId);
//         if (!currentUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const userPosts = await Post.find({ userId: currentUser._id });

//         const friendPosts = await Promise.all(
//             currentUser.following.map(async (friendId) => {
//                 return await Post.find({ userId: friendId });
//             })
//         );

//         res.json(userPosts.concat(...friendPosts));
//     } catch (err) {
//         console.error("Error fetching timeline:", err); // Log the error for debugging
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


module.exports=router;