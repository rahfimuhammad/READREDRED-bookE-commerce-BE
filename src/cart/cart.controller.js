const express = require("express")

const router = express.Router()

const { addToCart, getProductsInCart, removeFromCart, isProductInCart, deleteCart, productInCart, updateCart, deleteCartByUserId } = require("./cart.service")
const { verifyUser } = require('../middleware/authUser')

router.post("/", verifyUser, async (req, res) => {
    try {
        const newCartData = req.body
        const cart = await addToCart(newCartData)

        res.status(201).send({
            data: cart,
            message: "added to cart"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const id = req.params.userId
        const products = await getProductsInCart(id)

        res.send(products)

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:id", async (req, res) => {

    try {
        const cartId = req.params.id
        await removeFromCart(cartId)
        res.send("product deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/usercart/:userId", async (req, res) => {

    try {
        const userId = req.params.userId
        await deleteCartByUserId(userId)
        res.send("carts deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/check/:productId/:userId', async (req, res) => {
    try {
        const productId = req.params.productId
        const userId = req.params.userId

        // Panggil fungsi untuk memeriksa apakah produk ada dalam wishlist
        const isCart = await isProductInCart(productId, userId);

        res.status(200).json({ isCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:userId/:productId', async (req, res) => {

    try {
        const userId = req.params.userId
        const productId = req.params.productId

        const deleted = await deleteCart(userId, productId)

        res.status(200).send({message: "removed from cart"})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.patch('/:userId/:productId/:quantity', async (req, res) => {

    try {
        const userId = req.params.userId
        const productId = req.params.productId
        const quantity = parseInt(req.params.quantity)
        const cart = await productInCart(productId, userId)

        if (!cart) {
            return res.status(404).send({ message: "Product not found in cart" });
        }

        const newCart = await updateCart(cart?.id, quantity)
        res.status(200).send({message: "quantity updated"})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

module.exports = router