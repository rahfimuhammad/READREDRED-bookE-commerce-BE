const express = require("express")

const router = express.Router()

const { getTotalPages, createOrder, getAllOrder, getProductsInOrder, approveOrder, getTransactionsAdmin } = require("./order.service")
const { verifyUser, adminOnly } = require('../middleware/authUser')

router.post("/", async (req, res) => {
    try {
        const orderData = req.body

        const order = await createOrder(orderData)

        res.send({
            data: order,
            message: "order success"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const sortBy = req.query.sortBy || "dateDesc";
    
    try {
        const orders = await getAllOrder(page, pageSize, sortBy);
        const totalPages = await getTotalPages(pageSize);
        res.send({
                orders,
                totalPages
                });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:userId", async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const sortBy = req.query.sortBy || "dateDesc";

    try {
        const id = req.params.userId
        const products = await getProductsInOrder(id, pageSize, sortBy, page)

        res.send(products)

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/transactions/:status", async (req, res) => {
    const orderStatus = req.params.status;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    const sortBy = req.query.sortBy || "dateDesc"; // Default sorting by ID if not specified
  
    try {
      const transactions = await getTransactionsAdmin(orderStatus, page, pageSize, sortBy);

      res.send({transactions});
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.patch("/approve/:orderId", async (req, res) => {
    
    try {
        const id = req.params.orderId
        const status = req.body

        const updatedOrderStatus = await approveOrder(id, status)

        res.status(200).send({
            data: updatedOrderStatus,
            message: "status updated"
        })
        
    } catch (error) {
        
        res.status(400).send({message: error.message})
    }
})

router.delete("/:orderId", async (req, res) => {

    try {
        const orderId = req.params.orderId
        await deleteOrder(orderId)
        res.send("order canceled")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router