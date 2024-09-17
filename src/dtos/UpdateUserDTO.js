class UpdateUserDTO {
    constructor(firstName, lastName, bvn, email, phoneNumber, address, alternativePhoneNumber, religion, dateOfBirth, referralCode, gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.bvn = bvn;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.alternativePhoneNumber = alternativePhoneNumber;
        this.religion = religion;
        this.dateOfBirth = dateOfBirth;
        this.referralCode = referralCode;
        this.gender = gender;
    }
}

module.exports = UpdateUserDTO;
