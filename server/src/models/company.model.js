import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema({
    BusinessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    ledgerId: {
        type: Schema.Types.ObjectId,
        ref: 'IndividualAccount'
    },
    companyName: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String
    },
    phoneNo: {
        type: String,
    },
    companyDiscount: {
        type: Number
    },
    faxNo: {
        type: String,
    },
    email: {
        type: String
    },
    companyRegion: {
        type: String
    }
}, {
    timestamps: true
})


export const Company = mongoose.model("Company", CompanySchema);