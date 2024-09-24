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
const Mailgen = require('mailgen');
require('dotenv').config();
const transporter = require('../utils/mailer');
const https = require('https');

exports.registerMail = async (req, res) => {
  const { userEmail } = req.body
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: 'https://mailgen.js/'
    }
  })

  let response = {
    body: {
      name: "Nova Bank",
      intro: "You Transaction!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend application",
            price: "$10.99",
          }
        ]
      },
      outro: "Looking forward to do more business"
    }
  }
  let mail = MailGenerator.generate(response)

  let message = {
    from: process.env.AUTH_EMAIL,
    to: userEmail,
    subject: "Place Order",
    html: mail
  }
  transporter.sendMail(message)
    .then(() => {
      return res.status(201).json({ msg: "You should receive an email" });
    })
    .catch(error => {
      console.error("Error occurred while sending email:", error);
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
    const message = {
      from: process.env.AUTH_EMAIL,
      to: updatedUser.email,
      subject: "Registration Successful",
      html: `<p>Dear ${updatedUser.firstName}, your account has been successfully created. Your account number is ${updatedUser.accountNumber}.</p>`,
    };

    try {
      await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending registration email:", error);
    }

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

    // Send update email notification
    const message = {
      from: process.env.AUTH_EMAIL,
      to: updatedUser.email,
      subject: "Profile Updated",
      html: `<p>Dear ${updatedUser.firstName}, your profile has been updated successfully.</p>`,
    };

    try {
      await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending update email:", error);
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
    const message = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Balance Enquiry",
      html: `<p>Dear ${user.firstName}, your current account balance is ${balance}.</p>`,
    };

    try {
      await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending balance enquiry email:", error);
    }

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
    // Send credit notification email
    const message = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Account Credited",
      html: `<p>Dear ${user.firstName}, your account has been credited with ${amount}. Your new balance is ${updatedUser.accountBalance}.</p>`,
    };

    try {
      await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending credit notification email:", error);
    }

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
    // Send debit notification email
    const message = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Account Debited",
      html: `<p>Dear ${user.firstName}, your account has been debited by ${amount}. Your new balance is ${updatedUser.accountBalance}.</p>`,
    };

    try {
      await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending debit notification email:", error);
    }

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
    const sender = await User.findOne({ accountNumber: senderAccountNumber });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
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

    // Send transfer notification emails
    const senderMessage = {
      from: process.env.AUTH_EMAIL,
      to: sender.email,
      subject: "Transfer Made",
      html: `<p>Dear ${sender.firstName}, you have transferred ${amount} to account number ${receiverAccountNumber}. Your new balance is ${updatedSender.accountBalance}.</p>`,
    };

    const receiverMessage = {
      from: process.env.AUTH_EMAIL,
      to: receiver.email,
      subject: "Transfer Received",
      html: `<p>Dear ${receiver.firstName}, you have received ${amount} from account number ${senderAccountNumber}. Your new balance is ${updatedReceiver.accountBalance}.</p>`,
    };

    try {
      await transporter.sendMail(senderMessage);
      await transporter.sendMail(receiverMessage);
    } catch (error) {
      console.error("Error sending transfer notification emails:", error);
    }

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
    const message = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Login Notification",
      html: `<p>Dear ${user.firstName}, you have successfully logged in.</p>`,
    };

    await transporter.sendMail(message)
      .catch(error => console.error("Error sending login email:", error));

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send('Password is incorrect');
  }
};

exports.paystack = async (req, res) => {
  const https = require('https');
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email: email,
    amount: amount,
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  const reqPaystack = https.request(options, (resPaystack) => {
    let data = '';

    resPaystack.on('data', (chunk) => {
      data += chunk;
    });

    resPaystack.on('end', () => {
      res.send(JSON.parse(data)); // Send parsed JSON response
      console.log(JSON.parse(data));
    });
  }).on('error', (error) => {
    console.error(error);
    res.status(500).send({ error: 'Error verifying transaction' });
  });

  reqPaystack.write(params);
  reqPaystack.end();
};

exports.paystackVerify = (req, res) => {
  const reference = req.query.reference; // Get the reference from query parameters

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
  };

  https.request(options, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
    res.json(JSON.parse(data)); // Send the response back to the client
    });
  }).on('error', error => {
    console.error(error);
    res.status(500).send('Error verifying transaction');
  }).end();
};

exports.changePassword = async (req, res) => {
  const { id, password, newPassword } = req.body;

  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ status: "failed", message: "User not found" });
      }

      const verified = await bcrypt.compare(password, user.password);
      if (!verified) {
          return res.status(400).json({ status: "failed", message: "Invalid current password" });
      }

      // Hashing the new password before saving
      user.password = await bcrypt.hash(newPassword, 10); 
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      res.status(500).json({ status: "failed", message: "Internal server error", error: error.message });
  }
};
