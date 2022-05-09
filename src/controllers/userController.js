const userModel = require("../models/userModel");

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return true }  
    if (typeof (value) === "string" && value.trim().length == 0) { return true }
    return false
}

let register = async function (req, res) {
  try {
      let data = req.body

      const {name, phone, email, title} = data;


      let nameregex = /^[a-zA-Z ]{2,30}$/
      let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

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

      let duplicate = await userModel.findOne({ email: email })
      if (duplicate) {
          return res.status(400).send({ status: false, msg: "email already exist" })
      }
     
        let newUser = await userModel.create(data);

      res.status(201).send({status:false, message: 'Success', data:newUser})
  } catch (error) {
      res.status(500).send({status:false, message: error.message,})
  }
};


module.exports = register