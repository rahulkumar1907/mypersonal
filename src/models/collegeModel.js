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
        required: true

    },

    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('colleges', collegeSchema) 