const argon = require("argon2")
const prisma = require("../db")

const login = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
    if(!user) return res.status(404).send({message: "Email not found"})
    
    const match = await argon.verify(user.password, req.body.password)
    if(!match) return res.status(400).send({message: "Wrong password"})
    const id = user.id
    const username = user.username
    const email = user.email
    const role = user.role
    const wishlist = user.wishlist

    req.session.userId = user.id
    res.status(200).send({id, username, email, role, wishlist})
}

const me = async (req, res) => {
    if(!req.session.userId) {
        return res.status(401).send({message: "Please login to your account"})
    }
    const user = await prisma.user.findUnique({
        // attributes: ['id', 'username', 'email', 'role'],
        where: {
            id: req.session.userId
        }
    })
    if(!user) return res.status(404).send({message: "User not found"})
    res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    })

}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).send({message: "Cannot logout"})
        res.status(200).send({message: "You are logout"})
    })
}

module.exports = {
    login,
    me,
    logout
}