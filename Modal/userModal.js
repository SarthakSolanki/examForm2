const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const itemSchema = new mongoose.Schema({
    name : {
        type : String
    },
    price : {
        type : Number
    },
    rating : {
        type : String
    },
    fabric :{
        type : String
    },
    soldBy : {
        type : String
    },
    image :{
        type : String
    },
    deliveryCharge : {
        type : String
    },
    review : {
        type : String
    },
    size : [{
        type : String
      }
    ],
    details : {
        type : String
    },

    description : {
        type : String
    },
    discount : {
        type : String
    }

})

const categorySchema = new mongoose.Schema({
    name : {
        type : String
    },
    image : {
        type : String
    }
})

const registerationSchema = new mongoose.Schema({
    name : {
        type : String
    },
    contact : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    token : {
        type : String
    }

})

registerationSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) { 
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
            return next();
        } catch (error) {
            return next(error);
        }
    }
    return next();
});

const resellerSchema = mongoose.Schema({
    description : {
        type : String
    }
})

const supplierSchema = mongoose.Schema({
    name : {
        type : String
    },
    contact :{
        type : String
    },
    address :{
        type : String
    }
})



const paymentSchema = new mongoose.Schema({
    order_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    payment_id: {
      type: String,
    },

  })

const register = mongoose.model('register',registerationSchema)
const item = mongoose.model('product',itemSchema)
const topCategory = mongoose.model('category',categorySchema)
const reseller = mongoose.model('reseller',resellerSchema)
const supplier = mongoose.model('supplier',supplierSchema)
const payment = mongoose.model('payment',paymentSchema)


module.exports = {item,register,topCategory,reseller,supplier,payment}