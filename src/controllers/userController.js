const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return false }  
    if (typeof (value) === "string" && value.trim().length == 0) { return false }
    return true
}

///////////////////////// -CREATING USER- ///////////////////////////////


let registerUser = async function (req, res) {
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
      if (!keyValid(name)) return res.status(400).send({ status: false, message: "Name should be valid" })
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
      res.status(201).send({status:true, message: 'Success', data:newUser})

  } catch (error) {
      res.status(500).send({status:false, message: error.message,})
  }
};

///////////////////////// -LOGIN USER- ///////////////////////////////

const loginUser = async function (req, res) {
  
  try{
    let email = req.body.email;
    let password = req.body.password;
    let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

    if (!keyValid(email)) return res.status(400).send({status:false, messgage:"email is required"})
    if (!email.match(emailregex)) return res.status(400).send({ status: false, message: "Please enter valid email" })

  
    if (!keyValid(password)) return res.status(400).send({status:false, messsge:"password is required"})
    
    

    let checkedUser = await userModel.findOne({ email: email, password: password });
     if (!checkedUser) return res.status(404).send({ status: false, message: "email or password is not correct"});

     let currTime = Math.floor(Date.now()/1000)
     let token = jwt.sign(
       {
        userId: checkedUser._id.toString(),
        iat: currTime,
        exp: 1200 + currTime
      }, "functionUp"

    );
    res.setHeader("x-api-key",token)
    return res.status(200).send({ status: true, message: 'Success', Token: token });

  }
  catch (error) { 
    res.status(500).send({status:false, message: error.message })
  }
  };


module.exports.register = registerUser
module.exports.login = loginUser