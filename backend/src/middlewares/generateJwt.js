import jwt from 'jsonwebtoken'

export const generateJwt = (payload) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN || '1d',
    })

    return token
}
