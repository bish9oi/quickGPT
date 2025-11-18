

import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";

const transactionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User" , required: true},
    planId: {type: String , required:true},
    amount: {type: Number , required:true},
    credits: {type: Number , required:true},
    isPaid: {type: Boolean , default:false},
},{timestamps: true})

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction;