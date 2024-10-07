const auth = (req,res,next)=>{
    console.log(req.user);
    if(req.user?.id) return next()
    return res.sendStatus(401)
}

export default auth;
