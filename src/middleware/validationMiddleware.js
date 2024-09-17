const { body, validationResult } = require('express-validator');

exports.validateRegisterUser = [
    body('firstName')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .isString()
        .notEmpty()
        .withMessage('Last name is required'),
    body('bvn')
        .isNumeric()
        .isLength({ min: 11, max: 11 })
        .withMessage('BVN must be exactly 11 digits'),
    body('phoneNumber')
        .isNumeric()
        .isLength({ min: 11, max: 11 })
        .withMessage('Phone number must be exactly 11 digits'),
    body('alternativePhoneNumber')
        .optional()
        .isNumeric()
        .isLength({ min: 11, max: 11 })
        .withMessage('Alternative phone number must be exactly 11 digits'),
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('address')
        .isString()
        .notEmpty()
        .withMessage('Address is required'),
    body('religion')
        .optional()
        .isString()
        .isLength({ max: 20 })
        .withMessage('Religion cannot be more than 20 characters'),
    body('dateOfBirth')
        .isISO8601()
        .toDate()
        .withMessage('Date of birth must be a valid date in YYYY-MM-DD format'),
    body('referralCode')
        .optional()
        .isString()
        .isLength({ max: 20 })
        .withMessage('Referral code cannot be more than 20 characters'),
    body('password')
        .isString()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
