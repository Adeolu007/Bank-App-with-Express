const {Router } = require ("express");
const { query, validationResult, body, matchedData, checkSchema } = require('express-validator');
const { createUserValidationSchema } = require('../utils/validationSchemas');
const { validateRegisterUser } = require('../middleware/validationMiddleware');
const {registerUser, getAllUsers, getSingleUser, UpdateUser, deleteUser, balanceEnquiry, nameEnquiry, creditAccount, debitAccount, transferBetweenAccount, login} = require('../controller/users');

const router = Router();

router.post("/users",validateRegisterUser, registerUser);
router.get("/users", getAllUsers)
router.get("/users/:id", getSingleUser)
router.patch("/users/update", UpdateUser);
router.delete("/users/:id", deleteUser)
router.get("/users/account/:accountNumber", balanceEnquiry)
router.get("/users/nameEnquiry/:accountNumber", nameEnquiry)
router.post("/users/credit", creditAccount)
router.post("/users/debit", debitAccount) 
router.post("/users/transfer_between_account", transferBetweenAccount) 
router.post("/users/login", login)


module.exports = router
