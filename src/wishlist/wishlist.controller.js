const express = require("express")

const router = express.Router()

const { addToWishlist, getProductsInWishlist, removeFromWishlist, isProductInWishlist, deleteWishlist } = require("./wishlist.service")
const { verifyUser } = require('../middleware/authUser')

router.post("/", verifyUser, async (req, res) => {
    try {
        const newWishlist = req.body
        const wishlist = await addToWishlist(newWishlist)

        res.status(201).send({
            data: wishlist,
            message: "added to wishlist"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const id = req.params.userId
        const products = await getProductsInWishlist(id)

        res.send(products)

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:id", async (req, res) => {

    try {
        const wishlistId = req.params.id
        await removeFromWishlist(wishlistId)
        res.send("product deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/check/:productId/:userId', async (req, res) => {
    try {
        const productId = req.params.productId
        const userId = req.params.userId

        // Panggil fungsi untuk memeriksa apakah produk ada dalam wishlist
        const isWishlist = await isProductInWishlist(productId, userId);

        res.status(200).json({ isWishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:userId/:productId', async (req, res) => {

    try {
        const userId = req.params.userId
        const productId = req.params.productId

        const deleted = await deleteWishlist(userId, productId)

        res.status(200).send({message: "removed from wishlist"})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

module.exports = router