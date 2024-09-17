class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.accountNumber = user.accountNumber;
        this.accountBalance = user.accountBalance;
        this.address = user.address;
        this.alternativePhoneNumber = user.alternativePhoneNumber;
        this.religion = user.religion;
        this.dateOfBirth = user.dateOfBirth;
        this.referralCode = user.referralCode;
        this.gender = user.gender;
    }
}

module.exports = UserDTO;
