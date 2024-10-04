import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    const { username,email,first_name,last_name, password,password_confirm } = req.body;
    if(!username||!email||!first_name||!last_name||!password||!password_confirm){
        return res.status(422).json({message:"All fields are required"});
    }
    if(!password === password_confirm) return res.status(422).json({message:"Passwords do not match"});
    const userExits = await User.exists({email}).exec();
    if(userExits) return res.status(409).json({message:"User already exists"});
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({username,email,first_name,last_name,password:hashedPassword});
        return res.sendStatus(201);
    }catch(err){
        return res.status(400).json({message:err.message});
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email||!password){
        return res.status(422).json({message:"All fields are required"});
    }
    const user = await User.findOne({email}).exec();
    if(!user) return res.status(404).json({message:"User not found"});
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) return res.status(401).json({message:"Email or password incorrect"});
    const accessToken = jwt.sign(
        {
            id: user.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1800s"
        }
    )
    const refreshToken = jwt.sign(
        {
            id: user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:24*60*60*1000});
    return res.status(200).json({accessToken:accessToken});

};

const logout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({refreshToken:refreshToken}).exec();
    if(!user) return res.clearCookie('refreshToken',{httpOnly:true,sameSite:'None',secure:true}).sendStatus(204);
    user.refreshToken = null;
    await user.save();
    res.clearCookie('refreshToken',{httpOnly:true}).sendStatus(204);
};

const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken}).exec();
    if(!user) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || user.id !== decoded.id) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    id: user.id
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1800s"
                }
            );
            return res.status(200).json({accessToken:accessToken});
        }
    );
}
const user = async (req, res) => {};

export { register, login, logout, refresh, user };
