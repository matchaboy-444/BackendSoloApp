import { ReportModel } from "../models/ReportModels.js";
import { userModels } from "../models/RegisterUserModels.js";

export const GetReportedUser = async (req, res) => {


    try {
        const reporteduser = await ReportModel.find().populate("user", "username")

        if (!reporteduser) {
            return res.status(410).json({ message: "Gone" });
        }

        res.status(200).json({ message: "reported users", reporteduser })


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }

}

export const ReportUser = async (req, res) => {

    const { userId, reason } = req.body

    try {

        const FindUser = await userModels.findById(userId);

        if (!FindUser) {
            res.status(404).json({ message: "Not found" })
        }

        const report = new ReportModel({
            user: userId,
            reason: reason,
            status: {
                warning: false,
                deactivated: false
            }

        })

        await report.save()

        res.status(201).json({ message: `${FindUser.username} is reported for ${reason}` })
        console.log("User reported")

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }

}

export const WarningUser = async (req, res) => {
    console.log("jjjjj")
    const { userId } = req.params;
    try {


        const FindUserWarning = await ReportModel.findOne({ user: userId });

        if (!FindUserWarning) {
            res.status(404).json({ message: "Not found" })
        }

        await ReportModel.findByIdAndUpdate(FindUserWarning._id, { "status.warning": true }, { new: true })

        res.status(200).json({ message: "User has been warnned!" })
        console.log("user reported")

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }




}

export const DeactivateUser = async (req, res) => {
    const { userId } = req.params;
    try {


        const FindUserWarning = await ReportModel.findOne({ user: userId });

        if (!FindUserWarning) {
            res.status(404).json({ message: "Not found" })
        }

        await ReportModel.findByIdAndUpdate(FindUserWarning._id, { "status.deactivated": true }, { new: true })

        res.status(200).json({ message: "User has been Deactivated!" })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }

}