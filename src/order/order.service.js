const prisma = require("../db")

const getTotalPages = async (pageSize) => {
    const totalOrders = await prisma.order.count();
    const totalPages = Math.ceil(totalOrders / pageSize);
    return totalPages;
};

const createOrder = async (orderData) => {
    const newOrderData = orderData

    const order = await prisma.order.create({
        data: {
            userId: newOrderData.userId,
            price: newOrderData.price,
            status: "requested"
        }
    })

    return order
}

const getAllOrder = async (page, pageSize, sortBy) => {

    const skip = (page - 1) * pageSize;
    
    let orderBy;
    switch (sortBy) {
      case "dateAsc":
        orderBy = { createdAt: 'asc' };
        break;
      case "dateDesc":
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }
  
    const orders = await prisma.order.findMany({
      skip,
      take: pageSize,
      orderBy,
      include: {
            user: true,
            orderlist: {
                include: {
                    product: true
                }
            },
        },
      },
    );

    if (!orders) {
        throw Error("no order");
      }
    
      return orders || [];
};

const getOrderById = async (id) => {
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
    })

    if (!order) {
        throw Error("Product not found")
    }

    return order
}

const getProductsInOrder = async (userId, pageSize, sortBy, page) => {

    const skip = (page - 1) * pageSize;
      
    let orderBy;
    switch (sortBy) {
      case "dateAsc":
        orderBy = { createdAt: 'asc' };
        break;
      case "dateDesc":
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
      
    const order = await prisma.order.findMany({
        skip,
        orderBy,
        take: pageSize,
        where: { userId: userId },
        include: {
          user: true,
          orderlist: {
            include: {
              product: true}}
        }
      });
    
      return order || []
  }

const deleteOrder = async (id) => {

    await prisma.order.delete({
        where: {
            id,
        },
    })
}

const approveOrder = async (id, body) => {

    const status = body
    const order = await getOrderById(id)

    const updatedOrder = await prisma.order.update({
        where: { 
          id 
        },
        data: {
            userId: order.userId,
            price: order.price,
            status: status.status
        },
      });
      
      return updatedOrder;

}

const getTransactionsAdmin = async (status, page, pageSize, sortBy) => {
  const skip = (page - 1) * pageSize;

  let orderBy;
  switch (sortBy) {
    case "dateAsc":
      orderBy = { createdAt: 'asc' };
      break;
    case "dateDesc":
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const transactions = await prisma.order.findMany({
    where: {
      status
    },
    skip,
    take: pageSize,
    orderBy,
    include: {
      user: true,
      orderlist: {
        include: {
          product: true
        }
      }
    }
  });

  if (!transactions) {
    throw Error("No Transactions yet");
  }

  return transactions;
};

module.exports = {
    getTotalPages,
    createOrder,
    getAllOrder,
    deleteOrder,
    approveOrder,
    getProductsInOrder,
    getTransactionsAdmin
}