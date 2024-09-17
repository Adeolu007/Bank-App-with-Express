class RegisterUserDTO {
    constructor(firstName, lastName, bvn, phoneNumber, email, address, alternativePhoneNumber, religion, dateOfBirth, referralCode, password, gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.bvn = bvn;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
        this.alternativePhoneNumber = alternativePhoneNumber;
        this.religion = religion;
        this.dateOfBirth = dateOfBirth;
        this.referralCode = referralCode;
        this.password = password;
        this.gender = gender;
    }
}

module.exports = RegisterUserDTO;
