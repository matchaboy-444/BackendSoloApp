import multer from "multer";
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirPath = 'uploads'

        if(!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath)
        }
        else{

        console.log(file.mimetype)
        cb(null, dirPath)
        }
     },
    filename: (req, file, cb) => cb(null, "SoloConnect-" + Date.now() + "-" + file.originalname )
})

export const upload = multer({storage});