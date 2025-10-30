import { PostModel } from "../models/PostsModels.js";

export const AddReactions = async (req, res) =>{
    const {UserId} = req.body;
    const {PostId, reactions} = req.params
    try{
        const FindPost = await PostModel.findById(PostId)

        if(!FindPost){
            return res.status(404).json({message: "Post Not found"})
        }

        if(FindPost.reactions.find((r) => r.author.toString() === UserId)){
            return res.status(409).json({message: "Post Conflict"})
        }

        FindPost.reactions.push({author: UserId, reacts: reactions});

        const count = FindPost.reactions.length



        const SavePost = await FindPost.save()
        console.log(reactions)

        res.status(201).json({message: "Like Added", likes: SavePost.likes, count})




    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}