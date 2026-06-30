import jwt from 'jsonwebtoken'

const authDoctor = (req, res, next) => {
    try {
        const dtoken = req.headers.token;
        if (!dtoken || dtoken === 'false' || dtoken === 'null' || dtoken === 'undefined') {
            return res.json({ success: false, message: "Not authorized, Login Again" });
        }

        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET_KEY);
        req.docId = token_decode.id;

        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });

    }
}

export default authDoctor;