
const RegisterUserDTO = require('../dtos/RegisterUserDTO');
const User = require('../models/users');
const Transaction = require('../models/transaction');
const { generateAccountNumber } = require('../utils/generateAccountNumber')
const UserDTO = require('../dtos/UserDTO');
const UpdateUserDTO = require('../dtos/UserDTO');
const CreditTransactionDTO = require('../dtos/CreditTransactionDTO');
const TransferDTO = require('../dtos/TransferDTO');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/helpers')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen'); //use to structure your mail the way you want
require('dotenv').config();

exports.registerMail = async (req, res) => {
  const {userEmail} = req.body

// let testAccount = await nodemailer.createTestAccount();
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   // service: "gmail",
//   port: 465,  // Use port 465 for SSL (secure)
//   secure: true, // true for 465, false for other ports
//   auth: {
//       // user: process.env.AUTH_EMAIL, // Your Gmail email
//       // pass: process.env.AUTH_PASS, // App password, not your regular Gmail password
//       user: testAccount.user, // Your Gmail email
//       pass: testAccount.pass,
//     }
// });
// let message = {
//   from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//   to: "bar@example.com, baz@example.com", // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// };

// transporter.sendMail(message).then((info)=>{
//   return res.status(201).json({msg : "You should receive an email", info : info.messageId,
//     preview: nodemailer.getTestMessageUrl(info)
//   }).catch(error =>{
//     return res.status(500).json({error})
//   })
// })

let config = {
  service: 'gmail',
  auth:{
     user: process.env.AUTH_EMAIL, 
    pass: process.env.AUTH_PASS, 
    // user: "odunuyiadeolu@gmail.com",
    // pass: "vruuamhrpfewzlzl"
  }
}

let transporter = nodemailer.createTransport(config)
let MailGenerator = new Mailgen({
  theme: "default",
  product : {
      name: "Mailgen",
      link : 'https://mailgen.js/'
  }
})

let response = {
  body: {
      name : "Nova Bank",
      intro: "You Transaction!",
      table : {
          data : [
              {
                  item : "Nodemailer Stack Book",
                  description: "A Backend application",
                  price : "$10.99",
              }
          ]
      },
      outro: "Looking forward to do more business"
  }
}
let mail = MailGenerator.generate(response)

let message = {
  from : process.env.AUTH_EMAIL,
  // from: "odunuyiadeolu@gmail.com",
  to : userEmail,
  subject: "Place Order",
  html: mail
}
transporter.sendMail(message)
  .then(() => {
    return res.status(201).json({ msg: "You should receive an email" });
  })
  .catch(error => {
    console.error("Error occurred while sending email:", error); // Log the error details
    return res.status(500).json({ error });
  });

}



exports.registerUser = async (req, res) => {
  try {
    // Create DTO instance from request body
    const dto = new RegisterUserDTO(
      req.body.firstName,
      req.body.lastName,
      req.body.bvn,
      req.body.phoneNumber,
      req.body.email,
      req.body.address,
      req.body.alternativePhoneNumber,
      req.body.religion,
      req.body.dateOfBirth,
      req.body.referralCode,
      req.body.password,
      req.body.gender
    );
    dto.password = hashPassword(dto.password)
    const newUser = await User.create(dto);
    const accountNumber = generateAccountNumber();
    console.log(accountNumber)
    await User.findByIdAndUpdate(
      newUser._id,
      { $set: { accountBalance: 0, accountNumber } },
      { new: true }
    );
    const updatedUser = await User.findById(newUser._id);
    console.log(updatedUser)
    res.status(201).json(updatedUser);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const userDTOs = users.map(user => new UserDTO(user));
    res.status(200).json(userDTOs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getSingleUser = async (req, res) => {
  try {
    const { params: { id }, } = req;
    if (!id) return res.sendStatus(400);
    const user = await User.findById(id)
    if (!user) {
      res.status(404).json({ message: 'The user with the given ID was not found.' })
    }
    const userDTO = new UserDTO(user);
    res.status(200).json(userDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.UpdateUser = async (req, res) => {
  try {
    const { email, firstName, lastName, bvn, phoneNumber, address, alternativePhoneNumber, religion, dateOfBirth, referralCode, gender } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updateUserDTO = {
      firstName, lastName, bvn, phoneNumber,
      address, alternativePhoneNumber, religion,
      dateOfBirth, referralCode, gender
    };
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateUserDTO },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User update failed' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'User ID is required' });
    const result = await User.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.balanceEnquiry = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const balance = user.accountBalance;
    res.status(200).json({ message: 'Balance enquiry successful', balance });

  } catch (error) {
    console.error('Error in balance enquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.nameEnquiry = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const fullName = `${user.firstName} ${user.lastName}`;
    res.status(200).json({ message: 'Name enquiry successful', fullName });

  } catch (error) {
    console.error('Error in name enquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.creditAccount = async (req, res) => {
  try {
    const { transactionType, accountNumber, amount } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newTransaction = await Transaction.create({
      transactionType,
      accountNumber,
      amount,
      userId: user._id,
    });
    user.accountBalance += amount;
    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Credit successful',
      newBalance: updatedUser.accountBalance,
      transaction: newTransaction
    });

  } catch (error) {
    console.error('Error crediting account:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.debitAccount = async (req, res) => {
  try {
    const { transactionType, accountNumber, amount } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.accountBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    const newTransaction = await Transaction.create({
      transactionType,
      accountNumber,
      amount,
      userId: user._id,
    });
    user.accountBalance -= amount;
    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Debit successful',
      newBalance: updatedUser.accountBalance,
      transaction: newTransaction
    });

  } catch (error) {
    console.error('Error debiting account:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.transferBetweenAccount = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount } = req.body;

    // Find the sender by account number
    const sender = await User.findOne({ accountNumber: senderAccountNumber });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Find the receiver by account number
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if the sender has enough balance
    if (sender.accountBalance < amount) {
      return res.status(400).json({ message: 'Sender has insufficient balance' });
    }
    sender.accountBalance -= amount;
    const updatedSender = await sender.save();

    receiver.accountBalance += amount;
    const updatedReceiver = await receiver.save();
    const senderTransaction = await Transaction.create({
      transactionType: 'debit',
      accountNumber: senderAccountNumber,
      amount,
      userId: sender._id
    });
    const receiverTransaction = await Transaction.create({
      transactionType: 'credit',
      accountNumber: receiverAccountNumber,
      amount,
      userId: receiver._id
    });
    res.status(200).json({
      message: 'Transfer successful',
      senderBalance: updatedSender.accountBalance,
      receiverBalance: updatedReceiver.accountBalance,
      senderTransaction,
      receiverTransaction
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!user) {
    return res.status(400).send('User not found')
  } if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret,
      { expiresIn: '1d' }
    )
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send('password is wrong')
  }
}