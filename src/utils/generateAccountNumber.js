const generateAccountNumber = () => {
    const yearOfUserRegistration = new Date().getFullYear(); 
    const from = 100000;
    const to = 999999;
    const randomSixDigits = Math.floor(Math.random() * (to - from + 1) + from);
    const accountNumber = `${yearOfUserRegistration}${randomSixDigits}`; 
    return accountNumber;
}
module.exports = { generateAccountNumber };
