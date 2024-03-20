const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const session = require("express-session")

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}))

app.get("/api", (req, res) => {
    res.send("Hello There")
})

const productController = require("./product/product.controller")
const usersController = require("./users/users.controller")
const cartController = require("./cart/cart.controller")
const wishlistController = require("./wishlist/wishlist.controller")
const orderlistController = require("./orderlist/orderlist.controller")
const orderController = require("./order/order.controller")
const authController = require("./auth/auth.controller")

app.use("/products", productController)
app.use("/users", usersController)
app.use("/cart", cartController)
app.use("/wishlist", wishlistController)
app.use("/orderlist", orderlistController)
app.use("/order", orderController)
app.use(authController)

app.listen(PORT, () => {
    console.log("Express API running in port:" + PORT)
})