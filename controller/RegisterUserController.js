import { userModels } from '../models/RegisterUserModels.js';
import bcrypt from 'bcrypt'

export const UserInsert = async (req, res) => {
    
    const salt = await bcrypt.genSalt(10);

    const { username, firstname, middlename, lastname, gender, password } = req.body

    const AlreadyExistData = await userModels.findOne({ username });

    if (AlreadyExistData) {
        res.status(409).json({ message: "User Already Exist" })
        return;
    }

    try {

        const hashedpassw = await bcrypt.hash(password, salt);

        const newUsers = new userModels({
            username: username,
            firstname: firstname,
            middlename: middlename,
            lastname: lastname,
            gender: gender,
            joinedYear: new Date(),
            password: hashedpassw,
            idPhoto: 'http://192.168.1.23:4000/uploads/istockphoto-1553217328-612x612.jpg',

        })

        await newUsers.save()
        res.status(200).json({ message: "User Added", data: newUsers })
        console.log("user succesfully added")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }


}

export const UserUpdate = async (req, res) => {
    const {UserId} = req.params;
    const {UserDetailUpdate} = req.body;

    try{
        const FindUser = await userModels.findById(UserId);

        if(!FindUser){
            return res.status(404).json({message: "Not Found"})
        }

        const EditUser = await FindUser.updateOne({firstname: UserDetailUpdate.firstname, middlename: UserDetailUpdate.middlename, lastname: UserDetailUpdate.lastname, password: UserDetailUpdate.password, idPhoto: UserDetailUpdate.idPhoto});

        res.status(200).json({edited: EditUser})


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}