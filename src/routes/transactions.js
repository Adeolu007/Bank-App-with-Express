/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management
 */
 const { Router } = require("express");
const {getAllTransaction, getByAccountNumber} = require('../controller/transaction');


const router = Router();

/**
 * @swagger
 * /transaction/{accountNumber}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transactions by account number
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   transactionDate:
 *                     type: string
 *                     format: date-time
 *                   transactionType:
 *                     type: string
 *       404:
 *         description: No transactions found for this account number
 *       500:
 *         description: Server error
 */
router.get("/transaction/:accountNumber", getByAccountNumber)
/**
 * @swagger
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions
 *     description: Retrieves a list of all transactions in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of transactions
 *        
 *       404:
 *         description: No transactions found
 *       500:
 *         description: Server error
 */
router.get("/transactions", getAllTransaction)


module.exports = router



