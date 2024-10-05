/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const { Router } = require("express");
const { validateRegisterUser } = require('../middleware/validationMiddleware');
const {
    registerUser,
    getAllUsers,
    getSingleUser,
    UpdateUser,
    deleteUser,
    balanceEnquiry,
    nameEnquiry,
    creditAccount,
    debitAccount,
    transferBetweenAccount,
    login,
    registerMail,
    paystack,
    paystackVerify,
    changePassword
} = require('../controller/users');

const router = Router();



/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bvn:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               alternativePhoneNumber:
 *                 type: string
 *               religion:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               referralCode:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/users", validateRegisterUser, registerUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a single user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/users/:id", getSingleUser);

/**
 * @swagger
 * /users/update:
 *   patch:
 *     tags: [Users]
 *     summary: Update user information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bvn:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               alternativePhoneNumber:
 *                 type: string
 *               religion:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               referralCode:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/users/update", UpdateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /users/account/{accountNumber}:
 *   get:
 *     tags: [Users]
 *     summary: Get user balance by account number
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved balance
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/users/account/:accountNumber", balanceEnquiry);

/**
 * @swagger
 * /users/nameEnquiry/{accountNumber}:
 *   get:
 *     tags: [Users]
 *     summary: Get user full name by account number
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user full name
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/users/nameEnquiry/:accountNumber", nameEnquiry);

/**
 * @swagger
 * /users/credit:
 *   post:
 *     tags: [Users]
 *     summary: Credit a user's account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionType:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credit successful
 *       404:
 *         description: User not found
 *       400:
 *         description: Insufficient balance
 *       500:
 *         description: Server error
 */
router.post("/users/credit", creditAccount);

/**
 * @swagger
 * /users/debit:
 *   post:
 *     tags: [Users]
 *     summary: Debit a user's account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionType:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Debit successful
 *       404:
 *         description: User not found
 *       400:
 *         description: Insufficient balance
 *       500:
 *         description: Server error
 */
router.post("/users/debit", debitAccount);

/**
 * @swagger
 * /users/transfer_between_account:
 *   post:
 *     tags: [Users]
 *     summary: Transfer between accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderAccountNumber:
 *                 type: string
 *               receiverAccountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 *       404:
 *         description: Sender or receiver not found
 *       400:
 *         description: Insufficient balance
 *       500:
 *         description: Server error
 */
router.post("/users/transfer_between_account", transferBetweenAccount);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post("/users/login", login);

/**
 * @swagger
 * /users/gmail:
 *   post:
 *     tags: [Users]
 *     summary: Send registration email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email sent successfully
 *       500:
 *         description: Server error
 */
router.post("/users/gmail", registerMail);

/**
 * @swagger
 * /paystack:
 *   post:
 *     tags: [Users]
 *     summary: Handle Paystack payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment processed
 *       500:
 *         description: Server error
 */
router.post("/paystack", paystack);

/**
 * @swagger
 * /verify-transaction:
 *   get:
 *     tags: [Users]
 *     summary: Verify Paystack transaction
 *     responses:
 *       200:
 *         description: Transaction verified
 *       500:
 *         description: Server error
 */
router.get('/verify-transaction', paystackVerify);

/**
 * @swagger
 * /users/password-change:
 *   patch:
 *     tags: [Users]
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid current password
 *       500:
 *         description: Server error
 */
router.patch("/users/password-change", changePassword);

module.exports = router;

