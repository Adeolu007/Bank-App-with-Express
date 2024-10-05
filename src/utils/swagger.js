const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Momo Bank App',
            version: '1.0.0',
            description: `
    This API provides a comprehensive interface for managing banking transactions and user accounts within the momo Bank application. 
    It supports a wide range of functionalities, including:

    User Management
    - Register a new user account**: Create a new user with personal details.
    - Retrieve user details**: Get information about a specific user by ID.
    - Update user information**: Modify details of an existing user account.
    - Delete user account**: Remove a user account from the system.
    - Login: Authenticate users and issue JWT tokens for secure sessions.
    - Change password: Allow users to update their passwords securely.
    - Balance enquiry: Check the account balance for a specific account number.
    - Name enquiry: Retrieve the full name of a user based on their account number.

    Transaction Management
    - Record a transaction: Log various types of transactions (e.g., credits, debits).
    - Fetch transaction history: Retrieve a list of transactions for a specific account number.
    - Credit an account: Increase the balance of a user’s account.
    - Debit an account: Decrease the balance of a user’s account, ensuring sufficient funds are available.
    - Transfer between accounts: Move funds from one user account to another securely.

    Payment Gateway
    - Initialize payment: Start a payment process using the Paystack API.
    - Verify payment: Confirm the status of a payment using its reference with the Paystack API.

    The API follows RESTful principles, ensuring a structured and predictable way to interact with the backend services. 
    It is designed to be secure, efficient, and easy to integrate into client applications.`,
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [
        'src/routes/users.js',
        'src/routes/transactions.js'
    ],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Export the setup function directly
module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
