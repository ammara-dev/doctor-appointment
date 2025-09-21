import jwt from 'jsonwebtoken'

const authUser = (req, res, next) =>{
    try {
        const token = req.headers.token;
            if(!token) {
                return res.json({success : false, message : "Not authorized, Login Again"});
            }

            const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = token_decode.id;

            next();
    } catch (error) {
        console.log(error);
        return res.json({success : false, message : error.message});
        
    }
}

export default authUser;