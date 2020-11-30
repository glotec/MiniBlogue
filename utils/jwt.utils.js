var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0sjs6gf9mk9nwxq22n5hvpxmpgtty34tfx8gz17sy6djnm0xuc65bi9rcc';

//export func
module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        }
        )
    }
}