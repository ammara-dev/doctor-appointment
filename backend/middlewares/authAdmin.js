import jwt from 'jsonwebtoken'

const authAdmin = (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken || atoken === 'false' || atoken === 'null' || atoken === 'undefined') {
            return res.json({ success: false, message: "Not authorized, Login Again" });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET_KEY);
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not authorized, Login Again" });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });

    }
}

export default authAdmin;
