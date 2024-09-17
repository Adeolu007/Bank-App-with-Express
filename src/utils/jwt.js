const { expressjwt } = require('express-jwt');
require('dotenv').config();

function authJwt(){
    const secret = process.env.ACCESS_TOKEN_SECRET
    if (!secret) {
        throw new Error('Missing secret. Please set the secret environment variable.');
    }
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            '/api/v1/users/login', 
            '/api/v1/users'
        ]
    });
    async function isRevoked(req, payload, done) {
        console.log(payload); 
        if(payload.isAdmin == false) {
            return true;
        }
    
        console.log('Admin');
        return false;
    }
}
module.exports = authJwt;
