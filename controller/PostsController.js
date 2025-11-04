import { PostModel } from "../models/PostsModels.js";


export const PostInsert = async (req, res) => {
    const { userid, content } = req.body;
    const  file  = req.file

    console.log(file)

    try {
        const AddPost = new PostModel({
            author: userid,
            content: content,
            media: file ? file.filename : null,
            createdAt: new Date()
        })

        const SavePost = await AddPost.save()

        const SuccesfulPost = await SavePost.populate([
            {path: "author", select: "username"},
            {path: "reactions", select: "username"},
            {path: "comments", select: "username"},
        ])

        res.status(200).json({ message: "Posted Successfully!", data: SuccesfulPost, media: `/uploads/${file.filename}` })

        console.log("Post Added")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}

export const PostRead = async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit

    try {
        const GetPosts = await PostModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "username idPhoto").populate("reactions.author", "username").populate({path: 'sharedFrom', select: 'author media', populate: {
            path: 'author',
            select: 'username'
        }})

        const totalPosts = await PostModel.countDocuments()
        // console.log(GetPosts)

        res.status(200).json({ message: "Fetched Post", post: GetPosts, total: totalPosts })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }


}
export const PostUserRead = async (req, res) => {

    const id = req.query.id

    try {


        const FetchUserPost = await PostModel.find({ author: id }).sort({ createdAt: -1 }).populate("author", "username idPhoto")
        if (!FetchUserPost) {
            res.status(400).json({ message: "Not Found Post" })
            return

        }

            // console.log(FetchUserPost)
        const totalPosts = await PostModel.countDocuments()

        res.status(200).json({ message: "Post User Fetch Successful", userPost: FetchUserPost, total: totalPosts })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }

}

export const DeletePost = async (req,res) => {

    const { id } = req.params;

    try{
        const DeletePost = await PostModel.deleteOne({_id: id})

        if(DeletePost.deletedCount == 0){

         res.status(400).json({message: "Delete unsuccesful"});
         console.log("Delete Unsucess")

        }

         res.status(200).json({message: "Delete Post Succesful!"})
        console.log("Delete Succesful")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
    

}

export const EditPost = async (req, res) => {

    const { id } = req.params;
    const { UpdatedContent } = req.body

    

    try{

      const updating = await PostModel.findByIdAndUpdate(id, {content: UpdatedContent}, { new: true })

      if(!updating){
        res.status(406).json({message: "not valid"})
      console.log("Update unsucessful")

      }
      res.status(200).json({message: "Content Updated", updatedPost: updating})
      console.log("Updated Post", id)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}

export const SharedPost = async (req, res) => {

    const { UserId, PostId, caption } = req.body;


    try{
        const findPost = await PostModel.findById(PostId);

        if(!findPost){
         return res.status(400).json({message: "post unsuccesful"});

        }

        const InsertsharedPost = new PostModel({
            author: UserId,
            content: caption,
            sharedFrom: findPost._id,
            createdAt: new Date()
        })
 
        await InsertsharedPost.save();

        const sharedpost = await InsertsharedPost.populate(
            [{ path: 'author', select: 'username idPhoto'},
            { path:'sharedFrom', select: 'content media author', populate: {
                path: 'author', select: 'username idPhoto',
            }}]
        )

        res.status(200).json({shared: sharedpost, message: "sucess"})

        console.log(sharedpost)


    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }

}