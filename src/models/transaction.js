const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    trim: true,
    maxlength: [10, 'Transaction type cannot be more than 10 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  accountNumber: {
    type: String,
    trim: true,
    length: [10, 'Account number must be exactly 10 digits'],
    match: [/^\d{10}$/, 'Account number must be exactly 10 digits'],
  },
  amount: {
    type: Number,
    required: [true, 'Must provide account balance'],
    min: [0, 'Account balance cannot be negative'],
  },
  email: {
  },
  paystack_ref: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
