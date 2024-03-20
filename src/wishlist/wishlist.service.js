const prisma = require("../db")

const productInWishlist = async (productId, userId) => {
    const wishlistEntry = await prisma.wishlist.findFirst({
        where: {
            productId,
            userId,
        },
    });

    return wishlistEntry;
}

const addToWishlist = async (wishlistData) => {
    const newWishlistData = wishlistData;

    const existingWishlistItem = await productInWishlist(newWishlistData.productId, newWishlistData.userId);

    if (existingWishlistItem) {
        return newWishlistData

    } else {
        const newWishlist = await prisma.wishlist.create({
            data: {
                productId: newWishlistData.productId,
                userId: newWishlistData.userId,
            },
        });

        return newWishlist;
    }
};

const getAllWishlist = async (userId) => {
    if(typeof userId !== "number") {
        throw Error("ID is not a number")
    }

    const wishlists = await prisma.wishlist.findMany({
        where: {
            userId,
        },
    })

    if (!wishlists) {
        throw Error("cart is empty")
    }

    return wishlists
}

const getProductsInWishlist = async (userId) => {
    
    const wishlist = await prisma.wishlist.findMany({
        where: { userId: userId },
        include: {
          product: true 
        }
      });
    
      return wishlist || []
}

const removeFromWishlist = async (id) => {

    await prisma.wishlist.delete({
        where: {
            id
        },
    })
}

const deleteWishlist = async (userId, productId) => {
      
      await prisma.wishlist.deleteMany({
        where: {
            userId,
            productId
        }
      })
  };

const isProductInWishlist = async (productId, userId) => {
    const wishlistEntry = await prisma.wishlist.findFirst({
        where: {
            productId,
            userId,
        },
    });

    return !!wishlistEntry; // Mengembalikan true jika entri tersebut ada, false jika tidak
}

module.exports = {
    addToWishlist,
    getAllWishlist,
    getProductsInWishlist,
    removeFromWishlist,
    isProductInWishlist,
    deleteWishlist
}