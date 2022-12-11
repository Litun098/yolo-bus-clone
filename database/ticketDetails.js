const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    status:{
        type:Boolean
    },
    ticketNo:{
        type:Number,
        unique:true,
        sparse:true,
        min:1,
        max:40
    },
    userDetail:[{
        name:{
            type:String
        },
        age:{
            type:Number
        }
    }],
    sourse:{
        type:String
    },
    destination:{
        type:String
    }
});

const ticketModel = mongoose.Model('tickets',ticketSchema);
module.exports = {
    ticketModel
}