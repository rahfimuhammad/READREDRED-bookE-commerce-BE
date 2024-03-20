const prisma = require("../db")
const argon = require("argon2")

const getTotalPages = async (pageSize) => {
    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / pageSize);
    return totalPages;
};

const createUser = async (userData) => {
    const newUserData = userData
    const hashedPassword = await argon.hash(newUserData.password)
    const hashedConfirmPassword = await argon.hash(newUserData.confirmPassword)

    const user = await prisma.user.create({
        data: {
            username: newUserData.username,
            email: newUserData.email,
            phone: newUserData.phone,
            address: newUserData.address,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            role: "user"
        }
    })

    return {
        username: user.username,
        email: user.email,
        role: user.role
    }
}

const createAdmin = async (adminData) => {
    const newAdminData = adminData
    const hashedPassword = await argon.hash(newAdminData.password)
    const hashedConfirmPassword = await argon.hash(newAdminData.confirmPassword)

    const admin = await prisma.user.create({
        data: {
            username: newAdminData.username,
            email: newAdminData.email,
            password: hashedPassword,
            phone: newAdminData.phone,
            address: newAdminData.address,
            confirmPassword: hashedConfirmPassword,
            role: "admin"
        }
    })

    return {
        username: admin.username,
        email: admin.email,
        role: admin.role
    }
}

const getAllUsers = async (page, pageSize, sortBy) => {

    const skip = (page - 1) * pageSize;
    
    let orderBy;
    switch (sortBy) {
      case "nameAsc":
        orderBy = { name: 'asc' };
        break;
      case "nameDesc":
        orderBy = { name: 'desc' };
        break;
      case "emailAsc":
        orderBy = { email: 'asc' };
        break;
      case "emailDesc":
        orderBy = { email: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }
  
    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy,
      include: {
        carts: true,
        wishlists: true,
        order: true
        }
    });

    if (!users) {
        throw Error("No User Yet");
      }
    
      return users;
};

const getUserById = async (id) => {
    const userId = id
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            carts: true,
            wishlists: true,
            order: true
        }
    })

    return {
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
        carts: user.carts,
        wishlists: user.wishlists,
        order: user.order
    }
}

const updateUser = async (id, updateData) => {
    
    const user = await getUserById(id)
    let hashedPassword;
    let hashedConfirmPassword;

    if(updateData.password === "" || updateData.confirmPassword === "" || updateData.password === null || updateData.confirmPassword === null) {
        hashedPassword = user.password
        hashedConfirmPassword = user.confirmPassword
    } else {
        hashedPassword = await argon.hash(updateData.password)
        hashedConfirmPassword = await argon.hash(updateData.confirmPassword)
    }
    
    const userUpdate = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: updateData.username,
            email: updateData.email,
            phone: updateData.phone,
            address: updateData.address,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
        }
    })

    return {
        username: userUpdate.username,
        email: userUpdate.email,
        role: userUpdate.role
    }
}

const deleteUserById = async (id) => {
    await getUserById(id)

    await prisma.user.delete({
        where: {
            id,
        },
    })
}

module.exports = {
    getTotalPages,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    createAdmin, 
    deleteUserById
}