import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    const{username,email,password,first_name,last_name,password_confirm} = req.body;
    if(!username||!email||!password||!first_name||!last_name||!password_confirm){
        return res.status(422).json({message:"All fields are required"});
    }
    if(password !== password_confirm) return res.status(422).json({'msg':'Passwords do not match'})
    const userExists = await User.exists({email}).exec();
    if(userExists) return res.status(409);
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({email,username,password: hashedPassword,first_name,last_name});
        return res.sendStatus(201);
    }catch(err){
        return res.status(400).json({message:"could not register"});
    }


};

const login = async (req, res) => {
    const{email,password} = req.body;
    if(!email||!password){
        return res.status(422).json({message:"All fields are required"});
    }
    const user = await User.findOne({email});
    if(!user) return res.sendStatus(401);
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(401).json({message:'Email or password incorrect'});
    const accessToken = jwt.sign(
        {
        id:user.id,

    },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn :'1800s'
        }
    );
    const refreshToken = jwt.sign(
        {
            id:user.id,

        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn :'1d'
        }
    )
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:24*60*60*1000});
    res.json({accessToken:accessToken});
};

const logout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({refreshToken:refreshToken}).exec();
    if(!user) return res.clearCookie('refreshToken',{httpOnly:true}).sendStatus(204);
    user.refreshToken = null;
    await user.save();
    return res.clearCookie('refreshToken').sendStatus(204);
};

async function refresh(req, res){
    const cookies = req.cookies
    console.log(cookies.refreshToken)
    if(!cookies.refreshToken) return res.sendStatus(401)

    const refreshToken = cookies.refreshToken

    const user = await User.findOne({refreshToken: refreshToken}).exec()

    if(!user) return res.sendStatus(403)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || user.id !== decoded.id) return res.sendStatus(403)

            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1800s' }
            )

            res.json({access_token: accessToken})
        }
    )
}
const user = async (req, res) => {
    const user = req.user;
    return res.status(200).json(user)
};

export { register, login, logout, refresh, user };
