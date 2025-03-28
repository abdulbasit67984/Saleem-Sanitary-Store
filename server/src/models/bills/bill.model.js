import mongoose, { Schema } from "mongoose";

const BillProductsSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number
    },
    billItemDiscount: {
        type: Number
    },
    billItemPrice: {
        type: Number
    },
    billItemPack: {
        type: Number
    },
    billItemUnit: {
        type: Number
    },
}, {
    timestamps: true
})

const BillSchema = new Schema({
    BusinessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    salesPerson: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    billNo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    billType: {
        type: String,
        enum: ['A4', 'thermal'],
        default: 'thermal'
    },
    billPaymentType: {
        type: String,
        enum: ['cash', 'credit']
    },
    billItems: [BillProductsSchema],
    flatDiscount: {
        type: Number,
        default: 0
    },
    billStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'partiallypaid']
    },
    totalAmount: {
        type: Number
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    dueDate: { 
        type: Date,
        default: Date.now
    },
    isPosted: {
        type: Boolean,
        default: false
    },
    totalPurchaseAmount: {
        type: Number
    }
}, {
    timestamps: true
})


export const Bill = mongoose.model("Bill", BillSchema);