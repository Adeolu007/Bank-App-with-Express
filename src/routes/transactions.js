const {Router } = require ("express");
const {getAllTransaction, getByAccountNumber} = require('../controller/transaction');


const router = Router();

router.get("/transaction/:accountNumber", getByAccountNumber)
router.get("/transactions", getAllTransaction)


module.exports = router