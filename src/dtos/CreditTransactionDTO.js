class CreditTransactionDTO {
    constructor(transactionType, accountNumber, amount) {
        this.transactionType = transactionType;
        this.accountNumber = accountNumber;
        this.amount = amount;
    }
}

module.exports = CreditTransactionDTO;
