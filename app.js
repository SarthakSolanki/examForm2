const express = require("express")
const app = express()
const path = require('path')
const multer = require('multer')
const dotenv = require('dotenv').config({path:'./config/config.env'})
const MAIN_URL = process.env.MAIN_URL
const fs = require('fs')
require('./conn')
const bodyParser = require("body-parser")

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))



const addProduct = require('./Route/productRoute')
const getProduct = require('./Route/productRoute')
const deleteProduct = require('./Route/productRoute')
const editProduct = require('./Route/productRoute')
const filterProduct = require('./Route/productRoute')

const register = require('./Route/productRoute')
const login = require('./Route/productRoute')
const opt = require('./Route/productRoute')

const addCategory = require('./Route/productRoute')
const getCategory = require('./Route/productRoute')
const deleteCategory = require('./Route/productRoute')
const editCategory = require('./Route/productRoute')

const resellerPage = require('./Route/productRoute')

const addSupplier = require('./Route/productRoute')
const getSupplier = require('./Route/productRoute')
const deleteSupplier = require('./Route/productRoute')
const editSupplier = require('./Route/productRoute')
const pay = require('./Route/productRoute')

app.post('/upload',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    const storage = multer.diskStorage({
      
        destination: function (req, file, cb) {
          cb(null, './public/uploads/')
        },
        filename: function(req, file, callback) {
            callback(null, (Date.now()) + path.extname(file.originalname));
        }
    });
    
    const uploaFile = multer({
        storage: storage,
    }).single('image');
    
    uploaFile(req, res, async (err) => {
      
        if (!req.file) {
            res.status(500).send({
              sucecess: false,
              data: [],
               message: "Select File"
             });
          
        } else if (err) {
          res.status(500).send({
            sucecess: false,
            data: [],
             message: "not upload"
           });
         
        } else {
            res.status(200).send({
              sucecess: true,
              data: {filepath_url: req.file.filename,url: process.env.MAIN_URL+"/uploads/"+ req.file.filename},
              message:"",
            });
        }
    });
    // setTimeout(() => {
    //   fs.unlink('./public/uploads/' + req.file.filename, (err) => {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     console.log('File deleted successfully');
    //   });
    // }, 10000)
})

app.use('/api/v1',addProduct)
app.use('/api/v1',getProduct)
app.use('/api/v1',deleteProduct)
app.use('/api/v1',editProduct)
app.use('/api/v1',filterProduct)

app.use('/api/v1',register)
app.use('/api/v1',login)
app.use('/api/v1',opt)

app.use('/api/v1',addSupplier)
app.use('/api/v1',getSupplier)
app.use('/api/v1',deleteSupplier)
app.use('/api/v1',editSupplier)

app.use('/api/v1',resellerPage)

app.use('/api/v1',addCategory)
app.use('/api/v1',getCategory)
app.use('/api/v1',deleteCategory)
app.use('/api/v1',editCategory)

app.use('./api/v1',pay)


app.listen(5002,()=>{
    console.log("Hello World")
})