const { Schema, model } = require('mongoose');
const Wallet = require('./Wallet');

/**
 * -id
 * - walletId
 * - amount
 * - type [debit|credit]
 */

const transactionSchema = new Schema({
    address: String,
    balance: Number,
    walletId: {
        type: Schema.Types.ObjectId,
        ref: Wallet
    }
}, { timestamps: true })


module.exports = model('Transaction', transactionSchema);