const prisma = require("../db")

const addToOrderlist = async (orderData) => {
    const orderlistData = orderData;
        
    const orderlist = await prisma.orderlist.create({
            data: {
                orderId: orderlistData.orderId,
                userId: orderlistData.userId,
                productId: orderlistData.productId,
                quantity: parseInt(orderlistData.quantity)
            },
        });

        return orderlist;
};

const getAllOrderlist = async (userId) => {

    const orderlists = await prisma.orderlist.findMany({
        where: {
            userId,
        },
    })

    if (!orderlists) {
        throw Error("cart is empty")
    }

    return orderlists
}

const getOrderlistById = async (id) => {

    const orderlist = await prisma.orderlist.findUnique({
        where: {
            id,
        },
    })

    if (!orderlist) {
        throw Error("Product not found")
    }

    return orderlist
}

const deleteOrderlist = async (userId, productId) => {
      
    await prisma.cart.deleteMany({
      where: {
          userId,
          productId
      }
    })
};

module.exports = {
    addToOrderlist,
    getAllOrderlist,
    getOrderlistById,
    deleteOrderlist,
}