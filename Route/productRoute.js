
const express = require('express')
const router = express.Router()

const {addProduct,getProduct,deleteProduct,editProduct,filterProduct,
    registerUser,login,generateOTP,
    addCategory,deleteCategory,editCategory,getCategory,resellerPage,
    addSupplier,getSupplier,editSupplier,deleteSupplier,pay} = require('../Controller/productController')

router.route('/add-product').post(addProduct)
router.route('/get-product').get(getProduct)
router.route('/delete-product/:id').delete(deleteProduct)
router.route('/edit-product/:id').put(editProduct)
router.route('/filter').post(filterProduct)

router.route('/register').post(registerUser)
router.route('/login').post(login)

router.route('/add-category').post(addCategory)
router.route('/get-category').get(getCategory)
router.route('/delete-category/:id').delete(deleteCategory)
router.route('/edit-category/:id').put(editCategory)

router.route('/generate-otp').post(generateOTP)
router.route('/reseller-page').post(resellerPage)

router.route('/add-supplier').post(addSupplier)
router.route('/get-supplier').get(getSupplier)
router.route('/delete-supplier/:id').delete(deleteSupplier)
router.route('/edit-supplier/:id').put(editSupplier)

router.route('/pay').post(pay)

module.exports = router