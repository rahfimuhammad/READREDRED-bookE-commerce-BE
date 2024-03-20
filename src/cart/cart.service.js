const prisma = require("../db")

const isProductInCart = async (productId, userId) => {
    const cartEntry = await prisma.cart.findFirst({
        where: {
            productId,
            userId,
        },
    });

    return !!cartEntry;
}

const productInCart = async (productId, userId) => {
    const cartEntry = await prisma.cart.findFirst({
        where: {
            productId,
            userId,
        },
    });

    return cartEntry;
}

const addToCart = async (cartData) => {
    const newCartData = cartData;

    const existingCartItem = await productInCart(newCartData.productId, newCartData.userId);

    if (existingCartItem) {
        const updatedCart = await prisma.cart.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + newCartData.quantity,
            },
        });

        return updatedCart;
    } else {
        const newCart = await prisma.cart.create({
            data: {
                quantity: newCartData.quantity,
                productId: newCartData.productId,
                userId: newCartData.userId,
            },
        });

        return newCart;
    }
};

const getProductsInCart = async (userId) => {
    const cart = await prisma.cart.findMany({
      where: { userId: userId },
      orderBy: { id: 'asc' },
      include: {
        product: true,
      }
    });
  
    return cart || [];
};

const getCartById = async (id) => {

    const cart = await prisma.cart.findUnique({
        where: {
            id,
        },
    })

    if (!cart) {
        throw Error("Product not found")
    }

    return cart
}

const updateCart = async (id, qty) => {
    
    const cart = await getCartById(id)

    if(cart) {
        const updatedCart = await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                quantity: qty
            },
        });

        return updatedCart;
    }
}

const removeFromCart = async (id) => {
    await getCartById(id)

    await prisma.cart.delete({
        where: {
            id,
        },
    })
}

const deleteCart = async (userId, productId) => {
      
    await prisma.cart.deleteMany({
      where: {
          userId,
          productId
      }
    })
};

const deleteCartByUserId = async (userId) => {
    await prisma.cart.deleteMany({
        where: {
            userId
        }
    })
}

module.exports = {
    addToCart,
    getProductsInCart,
    removeFromCart,
    isProductInCart,
    productInCart,
    deleteCart,
    deleteCartByUserId,
    updateCart
}