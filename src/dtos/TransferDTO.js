class TransferDTO {
    constructor(senderAccountNumber, receiverAccountNumber, amount) {
      this.senderAccountNumber = senderAccountNumber;
      this.receiverAccountNumber = receiverAccountNumber;
      this.amount = amount;
    }
  }
  
  module.exports = TransferDTO;
  