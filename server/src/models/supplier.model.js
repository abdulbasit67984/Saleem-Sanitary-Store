import mongoose, { Schema } from "mongoose";

const SupplierSchema = new Schema({
    BusinessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    ledgerId: {
        type: Schema.Types.ObjectId,
        ref: 'IndividualAccount'
    },
    supplierName: {
        type: String,
        required: true
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
    supplierRegion: {
        type: String
    }
}, {
    timestamps: true
})


export const Supplier = mongoose.model("Supplier", SupplierSchema);