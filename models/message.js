const Mongo = require("mongoose");
const Schema = Mongo.Schema;

const messageSchema = new Schema({
    message: { type: String, required: true},
    },{timestamps:true});
const Message = Mongo.model("Message", messageSchema);

module.exports = Message;
