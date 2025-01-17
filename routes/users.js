const router= require("express").Router();
const User= require("../models/User");
const bcrypt= require("bcrypt");
// router.get("/",(req,res)=>{
//     res.send("It is user root")
// });

//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt= await bcrypt.genSalt(10);
                req.body.password= await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{ 
                $set: req.body,
            });
            res.status(200).json("Account has been updated!!");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account!!")
    }
});

//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted Successfully!!");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only your account!!")
    }
});

//get user
router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        //Remove things to not be displayed
        const {password, updatedAt, ...other}=user._doc
        res.status(200).json(other);
    }catch{
        return res.status(500).json(err);
    }
})

//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.bodyuserId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("you successfully followed the user")
            }else{
                res.status(403).json("You already follow the user!!")
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
})

//unfollow user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("you successfully unfollowed the user")
            }else{
                res.status(403).json("You dont follow the user!!")
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
})


module.exports= router