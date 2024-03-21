// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan function reusable

const prisma = require("../db")
const { getOrderByUserId } = require("../order/order.service")

const getTotalProducts = async () => {
  const totalProducts = await prisma.product.count()
  return totalProducts
}

const getTotalPages = async (pageSize) => {
    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / pageSize);
    return totalPages;
};

const getTotalPagesByCategory = async (category, pageSize) => {
    const totalProductsInCategory = await prisma.product.count({
      where: { category },
    });
    const totalPages = Math.ceil(totalProductsInCategory / pageSize);
    return totalPages;
};

const getTotalProductsByCategory = async (category) => {
    const totalProductsInCategory = await prisma.product.count({
      where: { category },
    });
    return totalProductsInCategory;
};

const getAllProducts = async (page, pageSize, sortBy) => {
    const skip = (page - 1) * pageSize;
    
    let orderBy;
    switch (sortBy) {
      case "nameAsc":
        orderBy = { name: 'asc' };
        break;
      case "nameDesc":
        orderBy = { name: 'desc' };
        break;
      case "priceAsc":
        orderBy = { price: 'asc' };
        break;
      case "priceDesc":
        orderBy = { price: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }
  
    const products = await prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy,
    });

    if (!products) {
        throw Error("Product not found");
      }
    
      return products;
};

const getProductById = async (id) => {

    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    })

    if (!product) {
        throw Error("Product not found")
    }

    return product
}

const getProductByName = async (name, page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: name,
                // mode: "insensitive",
            },
        },
        skip,
        take: pageSize,
    });
    return products;
};

const getProductByCategory = async (category, page, pageSize, sortBy) => {
    const skip = (page - 1) * pageSize;
  
    let orderBy;
    switch (sortBy) {
      case "nameAsc":
        orderBy = { name: 'asc' };
        break;
      case "nameDesc":
        orderBy = { name: 'desc' };
        break;
      case "priceAsc":
        orderBy = { price: 'asc' };
        break;
      case "priceDesc":
        orderBy = { price: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }
  
    const products = await prisma.product.findMany({
      where: {
        category,
      },
      skip,
      take: pageSize,
      orderBy,
    });
  
    if (!products) {
      throw Error("Product not found");
    }
  
    return products;
};

const createProduct = async (productData) => {
    const newProductData = productData

    const product = await prisma.product.create({
        data: {
            name: newProductData.name,
            author: newProductData.author,
            category: newProductData.category,
            quantity: newProductData.quantity,
            description: newProductData.description,
            image: newProductData.image,
            price: newProductData.price,
        }
    })

    return product
}

const deleteProductById = async (id) => {
    await getProductById(id)

    await prisma.product.delete({
        where: {
            id,
        },
    })
}

const editProductById = async (id, productData) => {

    await getProductById(id)

    const product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: productData.name,
            author: productData.author,
            category: productData.category,
            quantity: productData.quantity,
            description: productData.description,
            image: productData.image,
            price: productData.price,
        }
    })
        return product
}

const decreaseQuantity = async (id, productQty) => {
  const existingProduct = await getProductById(id);

  const updatedProduct = await prisma.product.update({
    where: { 
      id: id 
    },
    data: {
      quantity: existingProduct?.quantity - productQty,
    },
  });

  return updatedProduct;
};

module.exports = {
    getAllProducts,
    getTotalProducts,
    getProductById,
    createProduct, 
    deleteProductById,
    editProductById, 
    getProductByCategory,
    getProductByName,
    getTotalPages, 
    getTotalPagesByCategory,
    getTotalProductsByCategory,
    decreaseQuantity
}