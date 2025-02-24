import mongoose, { Schema } from "mongoose";

const SalePriceSchema = new Schema({
    salePrice1: {
        type: Number,
        required: true,
    },
    salePrice2: {
        type: Number
    },
    salePrice3: {
        type: Number
    },
    salePrice4: {
        type: Number
    }
}, {
    timestamps: true
})


export const SalePrice = mongoose.model("SalePrice", SalePriceSchema);