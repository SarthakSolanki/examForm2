const {item,register,topCategory,reseller,supplier,payment} = require('../modal/userModal')
const bcrypt = require('bcrypt')
const optGenerator = require('otp-generator')
const jwt = require('jsonwebtoken') 
const razorpay = require('razorpay')

const instance = new razorpay({
    key_id : process.env.KEY_ID,
    key_secret : process.env.SECRET_KEY
});

exports.registerUser = async (req,res)=>{
    const {name,contact,email,password} = req.body
    if(!name||!contact||!email||!password){
        return res.status(422).json({message:"Fill all the fields"})
    }
    try {
        const userExist = await register.findOne({email:email})
        if(userExist){
            return res.status(422).json({message:"User already exist use different email id"})
        }
        else{
            const user = new register({name,contact,email,password})
            const token = jwt.sign({user_id : user._id,email},process.env.TOKEN_KEY)
            user.token= token
            await user.save()
            return res.status(201).json(user)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.login = async(req,res)=>{
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "please fill the data" });
    }

    try {

    const userlogin = await register.findOne({ email: email });
    
    if(!userlogin){
        return res.status(404).json({message:"user not found"})
    }
    
    const isMatch = await bcrypt.compare(password,userlogin.password)
    if (isMatch) {
        const token = jwt.sign( { userLogin_id : userlogin._id, email } , process.env.TOKEN_KEY)
        userlogin.token = token
        return res.status(200).json(userlogin);
    } else {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

} catch (error) {
    console.log(error)
   }
}

exports.addProduct = async(req,res,)=>{     
    
    const{name,price,rating,fabric,soldBy,image,
        deliveryCharge,review,size,details,description,discount} = req.body
    try {
        const product = new item({name, price,rating, fabric, soldBy,image,
             deliveryCharge, review, size, details, description, discount})
        await product.save()
        return res.status(201).json({message : "Product Added Successfully"})
    } catch (error) {
        console.log(error)
    }
}

exports.getProduct = async(req,res)=>{

    const products = await item.find()
    const data = products.map(product=>({
        id : product._id,
        name : product.name,
        price : product.price,
        rating : product.rating,
        fabric : product.fabric,
        soldBy : product.soldBy,
        image : process.env.MAIN_URL + 'uploads/' + product.image,
        review : product.review,
        size : product.size,
        description : product.description,
        discount : product.discount
    }))
    return res.send(data)
}

exports.deleteProduct = async(req,res)=>{
    const data = await item.deleteOne({_id : req.params.id})
    return res.send(data)
}

exports.editProduct = async(req,res)=>{
    const data = await item.updateOne({_id : req.params.id},{$set:req.body})
    return res.send(data)
}


exports.filterProduct = async (req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const {name,price,rating,fabric,size,discount}  = req.body
    const names = Array.isArray(name) ? name : name ? [name] : [];
    const prices = Array.isArray(price) ? price : price ? [price] : [];
    const ratings = Array.isArray(rating) ? rating : rating ? [rating] : []
    const sizes = Array.isArray(size) ? size : size ? [size] : [];
    const fabrics = Array.isArray(fabric) ? fabric : fabric ? [fabric] : []
    const discounts = Array.isArray(discount) ? discount : discount ? [discount] : []

    const filter = {}
    if(names.length>0){
        filter.name = { $in: names }
    }    
    if(prices.length>0){
        filter.price = { $in: prices }
    }
    if(ratings.length>0){
        filter.rating = { $in: ratings }
    }  
    if(sizes.length>0){
        filter.size = { $in: sizes }
    }  
    if(fabrics.length>0){
        filter.fabric = { $in: fabrics }
    }  
    if(discounts.length>0){
        filter.discount = { $in: discounts }
    } 

    const products = await item.find({ $or : [filter] })  
    res.send(products)
}



exports.addCategory = async(req,res)=>{
    const{name,image} = req.body
    try {
        const product = new topCategory({name,image})
        await product.save()
        return res.status(201).json({message:"Product added successfully "})
    } catch (error) {
        console.log(error)
    }
}

exports.getCategory = async(req,res)=>{
    const data = await topCategory.find()
    return res.send(data)
}

exports.deleteCategory = async(req,res)=>{
    const data = await topCategory.deleteOne({_id : req.params.id})
    return res.send(data)
}

exports.editCategory = async(req,res)=>{
    const data = await topCategory.findByIdAndUpdate({_id : req.params.id},{$set : req.body})
    return res.status(data)
}


exports.resellerPage = async(req,res)=>{
    const {description} = req.body
    try {
        const data = new reseller({description})
        await data.save()
        res.status(201).json({message:"reseller page made"})
    } catch (error) {
        console.log(error)
    }
}


exports.addSupplier = async(req,res)=>{
    const{name,contact,address} = req.body
    try {
        const supplierExist = await supplier.findOne({contact:contact})
        if(supplierExist){
            return res.status(400).json({error:"Supplier already exist"})
        }
        const data = new supplier({name,contact,address})
        await data.save()
        return res.status(201).json({message:"Supplier Added Successfully"})
    } catch (error) {
        console.log(error)
    }
}

exports.getSupplier = async(req,res)=>{
    const data = await supplier.find()
    return res.send(data)
}

exports.editSupplier = async(req,res)=>{
    const data = await supplier.updateOne({_id : req.params.id}, {$set : req.body})
    return res.send(data)
}

exports.deleteSupplier = async(req,res)=>{
    const data = await supplier.deleteOne({_id : req.params.id})
    res.status(data)
}

exports.generateOTP = async(req,res)=>{
    const {contact} = req.body
    try {
        const isUser = await register.findOne({contact:contact})
        if(isUser){
            const otp = optGenerator.generate(6,{ digits : true, lowerCaseAlphabets : false,
                upperCaseAlphabets : false, specialChars : false })
            return res.json({ contact: contact, otp: otp }); 
        }
        else{
            
            return res.status(400).json({error: "User not registered"}) 
        }
    } catch (error) {
        console.log(error)
    } 
}

exports.pay = async(req,res)=>{
    const options = {
        amount : req.body.amount,
        currency : 'INR',
        receipt  : 'receipt_1'
    }

    try {
        const response = await instance.orders.create(options)
        res.json(response)
    } catch (error) {
        console.log(error)
    }
}
