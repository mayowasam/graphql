const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : ""
    // console.log(token);
    try {
        if (!token) {
            req.isAuth = false
            return next()
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
        if (!decodedToken) {
            req.isAuth = false
            return next()
        }
        // console.log(decodedToken.user);
        req.user = decodedToken.user
        req.isAuth = true

        // console.log('req.user',req.user);
        return next()
    } catch (error) {
        req.isAuth = false
        return next()
    }
}

module.exports = auth