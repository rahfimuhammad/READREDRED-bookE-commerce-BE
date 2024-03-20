// Layer untuk handle req dan res
// Handle validasi body

const express = require("express")
const { getAllProducts,
        getProductById,
        createProduct, 
        deleteProductById, 
        editProductById, 
        getProductByCategory, 
        getProductByName,
        getTotalProducts, 
        getTotalPages, 
        getTotalPagesByCategory,
        getTotalProductsByCategory,
        decreaseQuantity} = require("./product.service")
const { verifyUser, adminOnly } = require('../middleware/authUser')

const router = express.Router()

// router.get("/", async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.size) || 20;
//     const sortBy = req.query.sortBy || "id";
    
//     try {
//         const products = await getAllProducts(page, pageSize, sortBy);
//         const totalProducts = await getTotalProducts()
//         const totalPages = await getTotalPages(pageSize);
//         res.send({
//                 products,
//                 totalPages,
//                 totalProducts
//                 });
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 20;
    const sortBy = req.query.sortBy || "id";
    const category = req.query.category;
    
    try {
        let products;
        let totalProducts;
        let totalPages;

        if (category) {
            // Jika kategori disertakan dalam query params, cari produk berdasarkan kategori
            products = await getProductByCategory(category, page, pageSize, sortBy);
            totalProducts = await getTotalProductsByCategory(category);
            totalPages = await getTotalPagesByCategory(category, pageSize);
        } else {
            // Jika tidak, ambil semua produk
            products = await getAllProducts(page, pageSize, sortBy);
            totalProducts = await getTotalProducts();
            totalPages = await getTotalPages(pageSize);
        }
        
        res.send({
            products,
            totalPages,
            totalProducts
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:id", async (req, res) => {

    try {
        const productId = req.params.id
        const product = await getProductById(productId)

        res.send(product)

    } catch (error) {
        res.status(400).send(error.message)
    }

})

// router.get("/category/:category", async (req, res) => {
//     const productCategory = req.params.category;
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 20;
//     const sortBy = req.query.sortBy || "id"; // Default sorting by ID if not specified
  
//     try {
//       const products = await getProductByCategory(productCategory, page, pageSize, sortBy);
//       const totalPages = await getTotalPagesByCategory(productCategory, pageSize);

//       res.send({
//                 products,
//                 totalPages});
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
// });

router.get("/search/:name", async (req, res) => {
    const productName = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    
    try {
        const products = await getProductByName(productName, page, pageSize);
        res.send(products);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const newProductData = req.body
        const product = await createProduct(newProductData)

        res.status(201).send({
            data: product,
            message: "create product success"
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:id", async (req, res) => {

    try {
        const productId = req.params.id
        await deleteProductById(productId)
        res.send("product deleted")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/:id", async (req, res) => {

    try {
    const productId = req.params.id
    const productData = req.body

    const product = await editProductById(productId, productData)

    res.send({
        data: product,
        message: "update product success"
    })
    } catch (error) {

        res.status(400).send(error.message)
    }

})

router.patch("/checkout/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const productQty = req.body.quantity; // Pastikan properti ini sesuai dengan properti yang Anda gunakan di frontend
  
      const product = await decreaseQuantity(productId, productQty);
  
      res.send({
        data: product,
        message: "order success",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.put("/:id", verifyUser, adminOnly, async (req, res) => {
    const productId = req.params.id
    const productData = req.body

    if(!(productData.name && productData.price && productData.image && productData.description)) {
        return res.send("update product declined due to some fields are missing")

    }
    const product = await editProductById(productId, productData)

    res.send({
        data: product,
        message: "update product success"
    })
})

module.exports = router

