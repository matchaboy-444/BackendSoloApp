import { userModels } from "../models/RegisterUserModels.js";
import { MesssageModel } from "../models/MessagesModels.js";
import { PostModel } from "../models/PostsModels.js";
import { LiveModels } from "../models/LiveStreamModels.js";

export function socketing(io) {
    io.on('connection', async (socket) => {
        console.log("Connected", socket.id)

        socket.on('active', async (userid, name) => {
            console.log(name, "is active")
            await userModels.findByIdAndUpdate(userid, { 
                socketid: socket.id,
                active: true,
                connectedtime: new Date(),
                disconnectedtime: null
             }, { new: true })
            console.log("new socket id updated")
        })



        socket.on('MessagingPrivate', async ({ senderId, receiverId, dataInput }) => {

               try{
                   const InsertMessage = new MesssageModel({
                   senderId: senderId,
                   message: dataInput,
                   receiverId: receiverId
                   })

                   await InsertMessage.save()
                   console.log("message Insert")

                const receiver = await userModels.findById(receiverId);

                if(receiver.socketid){
                    io.to(receiver.socketid).emit("replies", {senderId, dataInput, receiverId});
                }
        


               }
                catch (err) {
                    console.log(err)
                }
            

        })

        socket.on('visitprofile', async(id, username) => {

            const finduser = await userModels.findById(id)

            if(!finduser){
                console.log("notfound")
            }

            io.emit('visitprofile', finduser);

        })

        socket.on('endlive', async (userid) => {

            const findlive = await LiveModels.findOne({user:userid})

            if(!findlive){
                console.log("notfound")
            }

            await LiveModels.deleteOne({_id: findlive._id})

            io.emit("endlive", "sucessful live")

            console.log("deleted live")

        })

        socket.on('add-comments', async ({userid, postid, commenttext}) => {
               try{
            
                   const FindPost = await PostModel.findById(postid).populate("comments.author", "username");
            
                   if(!FindPost){
                    console.log("not found")
                }
            
                   FindPost.comments.push({author: userid, commentText: commenttext});
            
                   const savecomment = await FindPost.save()

                   if(savecomment){
                    console.log("added comment on the post")
                   }

                    const newComment = savecomment.comments[savecomment.comments.length - 1];


                    io.to(postid).emit('get-comment', {postid: postid, comments: newComment})
                   
                }
                catch (err) {
                    console.log(err)
                }

        })

        socket.on('create-sololive', async ({liveId, id, topic}) => {

            try{
                    const FindUserLive = await userModels.findByIdAndUpdate(id, {live: true }, {new: true})
                    if(!FindUserLive){
                        console.log("Fail to make a live")
                    }

                    console.log(FindUserLive);

                    const addLive = new LiveModels({
                        user: id,
                        topic: topic,
                        type: "SoloLive",
                        timeStarted: Date.now()
                    })

                    await addLive.save();
                    console.log(`${FindUserLive.username}, is live`)
                    io.emit('sololive', addLive._id)

                    socket.join(liveId)
                    console.log(`${FindUserLive.username}, started a live`)

            }
            catch(err){
                console.log(err)
            }

        })

        
        socket.on('join-live', async (id) => {
            const joinlive = await LiveModels.findById(id).populate('user', 'username gender joinedYear idPhoto socketid')

            console.log(joinlive.user.socketid)
            if(joinlive){
                console.log("found live", joinlive.topic)
                socket.join(joinlive.user.socketid)
                io.to(joinlive.user.socketid).emit('join-live', joinlive)
            }
            
        })

        socket.on('userjoin', (joinuserid, to) =>{
            io.to(to).emit('userjoin', joinuserid)
            console.log(joinuserid)
            console.log(to)
        })

        socket.on('ice-candidate', ({liveId,candidate}) => {
            socket.to(liveId).emit('ice-candidate', candidate)
        })

        socket.on('offer', ({to, offer})=> {
            console.log(offer)
            console.log(to)

            socket.to(to).emit('offer', offer)

        })

        socket.on('answer', ({liveId, answer}) => {

            socket.to(liveId).emit('answer', answer);
        })

        socket.on('end-call', async (userid, liveid) => {
            if(!userid || !liveid)return
            const EndCall = await userModels.findByIdAndUpdate(userid, {live: false }, {new: true})
            if(!EndCall){
                console.log("not found")
            }

           const EndedTime =  await LiveModels.findByIdAndUpdate(liveid, {timeEnded: Date.now()}, {new: true})
            if(EndedTime){
                console.log(`ended at, ${EndedTime.timeEnded.toLocaleString()}`)
            }

        })


        socket.on('livecomments', async ({userid, to, comment, time}) => { 

            console.log(comment)

            const finduser = await userModels.findById(userid)

            console.log(finduser.username)

            console.log(to)

            const send = io.to(to).emit('livecomments', {author : finduser.username, comment: comment, time: time})

            if(!send){
                console.log("not sent")
            }
            console.log(to)

        })

        socket.on('disconnect', async () => {

            try{

            const finduser = await userModels.findOne({socketid: socket.id});

            if(!finduser){
                console.log("socketid problems")
                return
            }


            await userModels.findByIdAndUpdate(finduser._id, {
                active: false,
                disconnectedtime: new Date()
            }, { new: true })

            console.log('socket disconnected');

        //       const EndCall = await userModels.findByIdAndUpdate(userid, {live: false }, {new: true})
        //     if(!EndCall){
        //         console.log("not found")
        //     }

        //    const EndedTime =  await LiveModels.findByIdAndUpdate(liveid, {timeEnded: Date.now()}, {new: true})
        //     if(EndedTime){
        //         console.log(`ended at, ${EndedTime.timeEnded.toLocaleString()}`)
        //     }

        }
        catch (err) {
                    console.log(err)
                }
        
            


            
        })

    })
}