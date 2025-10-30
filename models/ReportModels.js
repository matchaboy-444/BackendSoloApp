import mongoose from "mongoose";

const ReportSchema =  new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reason: {type: String, enum:["Harassment", "Hate Speech", "Spamming", "Violence"], required: true},
    status: {
        warning: {type: Boolean},
        deactivated: {type: Boolean, default: false}
        
    }
})

export const ReportModel = mongoose.model('report', ReportSchema)