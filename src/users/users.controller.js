const express = require("express")

const router = express.Router()

const { getTotalPages, createUser, getAllUsers, getUserById, updateUser, deleteUserById, createAdmin } = require("./users.service")
const { verifyUser, adminOnly } = require('../middleware/authUser')

router.post("/", async (req, res) => {
    try {
        const newUserData = req.body
        if(newUserData.password !== newUserData.confirmPassword) {
            return res.status(400).send("password and confirm password not match")
        }
        const user = await createUser(newUserData)

        res.send({
            data: user,
            message: "register success"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post("/admin", async (req, res) => {
    try {
        const newAdminData = req.body
        if(newAdminData.password !== newAdminData.confirmPassword) {
            return res.status(400).send("password and confirm password not match")
        }
        const admin = await createAdmin(newAdminData)

        res.send({
            data: admin,
            message: "register success"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const sortBy = req.query.sortBy || "id"; // Default ke pengurutan berdasarkan nama secara ascending
    
    try {
        const users = await getAllUsers(page, pageSize, sortBy);
        const totalPages = await getTotalPages(pageSize);
        res.send({
                users,
                totalPages
                });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const user = await getUserById(userId)

        res.status(200).send(user)
    } catch (error) {

        res.status(404).send(error.message)
    }
})

router.patch("/:id", async (req, res) => {
    
    try {
        const update = req.body
        const id = req.params.id

        if(update.password !== update.confirmPassword) {
            return res.status(400).send("password and confirm password not match")
        }

        const updatedUser = await updateUser(id, update)

        res.status(200).send({
            data: updatedUser,
            message: "profile updated"
        })
        
    } catch (error) {
        
        res.status(400).send({message: error.message})
    }
})

router.delete("/:id", async (req, res) => {

    try {
        const userId = req.params.id
        await deleteUserById(userId)
        res.send("user deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router