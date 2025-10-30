import { userModels } from "../models/RegisterUserModels.js";
import { PostModel } from "../models/PostsModels.js";
import bcrypt from "bcrypt"

export const LogInController = async (req, res) => {

    const { username, password } = req.body;

    try {

        if(username === "admin" && password === "password"){
            res.status(202).json({ message: "admin" })
            console.log("Admin logged in")
        }

        const FindLogIn = await userModels.findOne({ username: username})

        if (!FindLogIn) {
            res.status(410).json({message: "Gone"})
            console.log("gone")
        }
        if(FindLogIn.deactivated){
            return res.status(403).json({message: "Forbidden"})

        }

        const isMatched = await bcrypt.compare(password, FindLogIn.password)

        if(!isMatched) {
            res.status(400).json({message: "Not Found"})
        }


        const FindUserPost = await PostModel.find({author: FindLogIn._id});

        const totalreactions = FindUserPost.reduce((acc, post) => acc + post.reactions.length, 0)


        res.status(200).json({ message: "LogIn Successful", data: FindLogIn, totalpost: FindUserPost.length, totalreactions: totalreactions })
        console.log("LogIn Successful")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }



}

export const GetAllActiveUsers = async (req, res) => {
    try{

    const GetUsers = await userModels.find({}, 'username firstname middlename lastname active password connectedtime disconnectedtime');

        if(!GetUsers){
            return res.status(404).json({message: "Post Not found"})

        }


        res.status(200).json({message: "sucess", AllUsers: GetUsers})

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}