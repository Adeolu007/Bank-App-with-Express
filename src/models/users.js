const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Must provide first name'],
    trim: true,
    maxlength: [20, 'First name cannot be more than 20 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Must provide last name'],
    trim: true,
    maxlength: [20, 'Last name cannot be more than 20 characters'],
  },
  otherName: {
    type: String,
    trim: true,
    maxlength: [20, 'Other name cannot be more than 20 characters'],
  },
  accountNumber: {
    type: String,
    // required: [true, 'Must provide account number'],
    trim: true,
    length: [10, 'Account number must be exactly 10 digits'],
    match: [/^\d{10}$/, 'Account number must be exactly 10 digits'],
  },
  accountBalance: {
    type: Number,
    // required: [true, 'Must provide account balance'],
    // min: [0, 'Account balance cannot be negative'],
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Must provide phone number'],
    trim: true,
    length: [11, 'Phone number must be exactly 11 digits'],
    match: [/^\d{11}$/, 'Phone number must be exactly 11 digits'],
  },
  alternativePhoneNumber: {
    type: Number,
    trim: true,
    maxlength: [11, 'Alternative phone number cannot be more than 11 digits'],
    match: [/^\d{11}$/, 'Alternative phone number must be exactly 11 digits'],
  },
  email: {
    type: String,
    required: [true, 'Must provide email'],
    trim: true,
    maxlength: [50, 'Email cannot be more than 50 characters'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Email is not valid'],
  },
  gender: {
    type: String,
    required: [true, 'Must provide gender'],
    trim: true,
    // enum: ['male', 'female', 'other'], // Adjust as needed
  },
  address: {
    type: String,
    required: [true, 'Must provide address'],
    trim: true,
    maxlength: [100, 'Address cannot be more than 100 characters'],
  },
  religion: {
    type: String,
    trim: true,
    maxlength: [20, 'Religion cannot be more than 20 characters'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Must provide date of birth'],
  },
  bvn: {
    type: Number,
    required: [true, 'Must provide BVN'],
    trim: true,
    length: [11, 'BVN must be exactly 11 digits'],
    match: [/^\d{11}$/, 'BVN must be exactly 11 digits'],
  },
  referralCode: {
    type: String,
    trim: true,
    maxlength: [20, 'Referral code cannot be more than 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'Must provide password'],
    trim: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  isAdmin: {
    type: Boolean,
    default: true,
},
});

module.exports = mongoose.model('User', UserSchema);
