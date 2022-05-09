const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return true }  
    if (typeof (value) === "string" && value.trim().length == 0) { return true }
    return false
}

let register = async function (req, res) {
  try {
      let data = req.body

      const {name, phone, email, password, title} = data;

      if(!Object.keys(data).length) return res.status(400).send({status:false, message: "you must enter data"})
      let nameregex = /^[a-zA-Z ]{2,30}$/
      let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

      if(!title) return res.status(400).send({ status: false, message: "Please enter a title"})
      if(!title.match(/^(Miss|Mr|Mrs)$/)) return res.status(400).send({ status: false, message: "enter valid title" })
     

      if (!name) { return res.status(400).send({ status: false, message: "Please enter name" }) }
      if (keyValid(name)) return res.status(400).send({ status: false, message: "Name should be valid" })
      if (!name.match(nameregex)) return res.status(400).send({ status: false, message: "Firstname should only contain alphabet" })
         data.name=name.split(' ').filter(word => word).join(' ')

        if (!phone) return res.status(400).send({ status: false, message: " Please enter phone No." })
        if (!phone.match(phoneRegex)) return res.status(400).send({ status: false, message: "Please enter valid phone" })

        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "phone Number already exist" })

        if (!email) return res.status(400).send({ status: false, message: " please enter email" })
        if (!email.match(emailregex)) return res.status(400).send({ status: false, message: "Please enter valid email" })

        if (!password) return res.status(400).send({ status: false, message: "please enter password"})

      let duplicate = await userModel.findOne({ email: email })
      if (duplicate) {
          return res.status(400).send({ status: false, msg: "email already exist" })
      }
     
        let newUser = await userModel.create(data);

      res.status(201).send({status:false, message: 'Success', data:newUser})
  } catch (error) {
      res.status(500).send({status: true, message: error.message,})
  }
};

const login = async function (req, res) {
  
  try{
    const email = req.body.email;
    const password = req.body.password;
  
    if (!password){
       return res.status(400).send({status:false, msg:"password is required"})
    }
  
    if (!email){
      return res.status(400).send({status:false, msg:"email is required"})
    }

    const checkedUser = await userModel.findOne({ email: email, password: password });
     if (!checkedUser) {
    return res.status(404).send({ status: false, msg: "email or password is not correct"});
   }
   else {
     const token = jwt.sign({ userId: checkedUser._id.toString() },"functionUp");
     return res.status(201).send({ status: true, Token: token });
  }
  }
  catch (error) { res.status(500).send({ msg: error.message })}};


module.exports.register = register
module.exports.login = login