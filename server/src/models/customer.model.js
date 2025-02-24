import mongoose, { Schema } from "mongoose";

// Define the User Schema
const CustomerSchema = new Schema({
    BusinessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    ledgerId: {
        type: Schema.Types.ObjectId,
        ref: 'IndividualAccount'
    },
    customerName: {
        type: String,
        required: true
    },
    ntnNumber: {
        type: String,
    },
    mobileNo: {
        type: String
    },
    phoneNo: {
        type: String,
    },
    faxNo: {
        type: String,
    },
    email: {
        type: String
    },
    cnic: {
        type: String
    },
    customerRegion: {
        type: String
    },
    customerFlag: {
        type: String,
        enum: ['white', 'yellow', 'green', 'red'],
        default: 'red'
    }
}, {
    timestamps: true
})


export const Customer = mongoose.model("Customer", CustomerSchema);