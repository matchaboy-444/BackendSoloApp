import { PostModel } from "../models/PostsModels.js";

export const GetCommentPost = async (req, res) => {
    const { PostId } = req.params;

    try{
       const FindPost = await PostModel.findById(PostId).populate("comments.author", "username idPhoto")

       if(!FindPost){
        return res.status(404).json({message: "Not found"})
       }
    
       const count = FindPost.comments.length


       res.status(200).json({message: "Comments", comments: FindPost.comments, count})
    }
     catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}