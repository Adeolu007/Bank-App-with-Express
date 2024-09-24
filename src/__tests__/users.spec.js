const {registerUser, getAllUsers, getSingleUser, UpdateUser, deleteUser, balanceEnquiry, nameEnquiry, creditAccount, debitAccount, transferBetweenAccount, login, registerMail, paystack, paystackVerify, changePassword} = require('../controller/users');
const User = require('../models/users');
const UserDTO = require('../dtos/UserDTO');
const transporter = require('../utils/mailer'); // Adjust this import based on your setup
const RegisterUserDTO = require('../dtos/RegisterUserDTO');
jest.mock('../models/users');
jest.mock('../utils/mailer')

const mockRequest = {
    params: { id: 1 }, // User ID to test with
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn(),
};


describe('get users', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should get user by id', async () => {
        const mockUser = { id: 1 }; // Example user data
        User.findById.mockResolvedValue(mockUser); // Mock the User model's findById method

        await getSingleUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.any(UserDTO)); // Assuming UserDTO transforms the user correctly
    });

    it('should return 404 if user is not found', async () => {
        User.findById.mockResolvedValue(null); // No user found

        await getSingleUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The user with the given ID was not found.' });
    });

    it('should return 400 if no ID is provided', async () => {
        const reqWithoutId = { params: {} }; // No ID in params

        await getSingleUser(reqWithoutId, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 500 on error', async () => {
        User.findById.mockRejectedValue(new Error('Database error')); // Simulate an error

        await getSingleUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});

describe('registerUser', () => {
    const mockRequest = {
        body: {
            firstName: 'John',
            lastName: 'Doe',
            bvn: '12345678901',
            phoneNumber: '0123456789',
            email: 'john.doe@example.com',
            address: '123 Street',
            alternativePhoneNumber: '9876543210',
            religion: 'None',
            dateOfBirth: '1990-01-01',
            referralCode: 'REF123',
            password: 'password',
            gender: 'Male'
        }
    };

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should register a user successfully', async () => {
        const mockUser = { _id: '1', ...mockRequest.body, accountNumber: 'ACC123', accountBalance: 0 };
        User.create.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockResolvedValue(mockUser);
        User.findById.mockResolvedValue(mockUser);
        
        await registerUser(mockRequest, mockResponse);

        expect(User.create).toHaveBeenCalledWith(expect.any(RegisterUserDTO));
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            mockUser._id,
            { $set: { accountBalance: 0, accountNumber: expect.any(String) } },
            { new: true }
        );
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors during user creation', async () => {
        User.create.mockRejectedValue(new Error('Database error'));

        await registerUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should handle errors during email sending', async () => {
        const mockUser = { _id: '1', ...mockRequest.body, accountNumber: 'ACC123', accountBalance: 0 };
        User.create.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockResolvedValue(mockUser);
        User.findById.mockResolvedValue(mockUser);
        transporter.sendMail.mockRejectedValue(new Error('Email error'));

        await registerUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUser); // Should still respond with user even if email fails
    });
});