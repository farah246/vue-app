import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

const authentication=(req,res,next)=>{
    const authHeader =  req.header.authorization || req.headers.Authorization
    if(authHeader?.startsWith('Bearer')){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decoded)=>{
            if(err) {
                req.user ={}
                return next()
            }
            const user = await User.findById(decoded.id).select({password:0,refreshToken:0}).exec();
            if(user){
                req.user =  user.toObject({getters:true});
            }else{
                req.user = {};
            }
            return next();
        })
    }
}
