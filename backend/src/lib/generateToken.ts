import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const generateToken = (userId:string) =>{
    const accessToken = jwt.sign({userId},process.env.ACCESSTOKEN,{
        expiresIn:'15m'
    })

    const refreshToken = jwt.sign({userId},process.env.REFRESHTOKEN,{
        expiresIn:'7d'
    })

    return {accessToken , refreshToken}
}
