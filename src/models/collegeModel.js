const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (name) {
                return /^[a-zA-Z ]{2,70}$/.test(name)
            }, msg: 'please fill a valid name', isAsync: false
        }
    },
    fullname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (fullname) {
                return /^[a-zA-Z ]{2,70}$/.test(fullname)
            }, msg: 'please fill a valid fullname', isAsync: false
        }
    },
    logoLink: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (logoLink) {
                return  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*\.(?:png|jpg|jpeg))*$/.test(logoLink)
            }, msg: 'please provide valid URL', isAsync: false
        }
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('colleges', collegeSchema) 