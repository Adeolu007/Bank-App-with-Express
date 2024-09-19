const User = require('../models/users');
const Transaction = require('../models/transaction');
require('dotenv').config();


exports.getAllTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find().select('-_id -userId');
        if (!transactions.length) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getByAccountNumber = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const transactions = await Transaction.find({ accountNumber }).select('-_id -userId'); // Exclude _id and userId from results

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this account number' });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
