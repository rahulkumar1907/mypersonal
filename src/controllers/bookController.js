const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')

///////////////////////// -CREATING BOOK- ///////////////////////////////

let createBook = async function (req, res) {
    try {
        let data = req.body
  
        const {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = data;
  
        if(!Object.keys(data).length) return res.status(400).send({status:false, message: "you must enter data"})

        if(!title) return res.status(400).send({ status: false, message: "Please enter a title"})
        let duplicateTitle = await userModel.findOne({ title: title })
        if (duplicateTitle) return res.status(400).send({ status: false, message: "title already exist" })
        

        
        let newBook = await userModel.create(data);
        res.status(201).send({status:true, message: 'Success', data:newBook})
  
    } catch (error) {
        res.status(500).send({status: true, message: error.message,})
    }
  };

module.exports.createBook = createBook

