const prisma = require("../db")

const verifyUser = async (req, res, next) => {
    if(!req.session.userId) {
        return res.status(401).send({message: "Please login to your account"})
    }
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        }
    })
    if(!user) return res.status(404).send({message: "User not found"})
    req.userId = user.id
    req.role = user.role
    next()
}

const adminOnly = async (req, res, next) => {
    
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        }
    })
    if(!user) return res.status(404).send({message: "User not found"})
    if(user.role !== role) return res.status(403).send({message: "Forbidden"})
    next()
}

module.exports = {
    verifyUser,
    adminOnly
}