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

export const StartLive = async (req,res) => {
    const {userid, topic, time, link} = req.body
    console.log('logggggggededdd')
    try{
        const InsertLive = new LiveModels({
            user: userid,
            topic: topic,
            timeStarted: new Date(time).toLocaleTimeString(),
            timeEnded: null,
            link: link
        })

        await InsertLive.save()
        console.log('live has been made')

        res.status(201).json({ message: "Live Created" })


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}