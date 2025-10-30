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

        socket.on('sololive', async (id, topic) => {
            try{
                    const FindUserLive = await userModels.findByIdAndUpdate(id, {live: true }, {new: true})
                    if(!FindUserLive){
                        console.log("Fail to make a live")
                    }

                    const addLive = new LiveModels({
                        user: id,
                        topic: topic,
                        type: "SoloLive",
                        timeStarted: Date.now()
                    })

                    await addLive.save();
                    console.log(`${FindUserLive.username}, is live`)

                    socket.join(addLive._id.toString())

                    io.emit('sololive', addLive._id)

                    console.log(addLive._id)

            }
            catch(err){
                console.log(err)
            }
        })

        socket.on('ice-candidate', ({candidate}) => {
            socket.broadcast.emit('ice-candidate', {candidate})
        })

        socket.on('offer', (offer) => {
            // console.log(offer);

            socket.broadcast.emit('offer', offer)
        })

        socket.on('answer', (answer) => {

            socket.broadcast.emit('answer', answer)
        })

        socket.on('end-call', async (userid, liveid) => {
            const EndCall = await userModels.findByIdAndUpdate(userid, {live: false }, {new: true})
            if(!EndCall){
                console.log("not found")
            }

           const EndedTime =  await LiveModels.findByIdAndUpdate(liveid, {timeEnded: Date.now()}, {new: true})
            if(EndedTime){
                console.log(`ended at, ${EndedTime.timeEnded.toLocaleString()}`)
            }

        })

        socket.on('joinlive', async (id) => {
            const joinlive = await LiveModels.findById(id).populate('user', 'username idPhoto gender joinedYear sockeid')

            if(joinlive){
                console.log("found live", joinlive.topic)
                socket.join(id)
            io.to(id).emit('joinlive', joinlive)
            }
            
        })

        socket.on('livecomments', async ({userid, to, comment, time}) => { 

            console.log(comment)

            const finduser = await userModels.findById(userid)

            io.to(to).emit('livecomments', {userid : finduser, comment: comment, time})

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

        }
        catch (err) {
                    console.log(err)
                }
        
            


            
        })

    })
}