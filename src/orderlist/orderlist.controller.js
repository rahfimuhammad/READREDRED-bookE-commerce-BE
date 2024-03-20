const express = require("express")

const router = express.Router()

const { addToOrderlist, getAllOrderlist, deleteOrderlist } = require("./orderlist.service")
const { verifyUser } = require('../middleware/authUser')

router.post("/", async (req, res) => {
    try {
        const orderlistData = req.body
        const orderlist = await addToOrderlist(orderlistData)

        res.status(201).send({
            data: orderlist,
            message: "order created"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const orderlists = await getAllOrderlist(userId)

        res.send(orderlists)

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:userId/:productId", async (req, res) => {

    try {
        const orderlistId = req.params.id
        await deleteOrderlist(orderlistId)
        res.send("product deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router