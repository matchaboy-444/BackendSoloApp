import { LiveModels } from "../models/LiveStreamModels.js";

export const GetLiveStreams = async (req, res) => {
    try{

       const getLive =  await LiveModels.find({timeEnded: null}).populate('user', 'username idPhoto gender joinedYear')
       if(!getLive){
        res.status(404).json({message: "Not Found"})
       }

       
       res.status(200).json({message: "Sucessful", getLive: getLive})

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}