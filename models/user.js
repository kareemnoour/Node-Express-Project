const Mongo = require("mongoose");
const moment = require("moment")
const Schema = Mongo.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
},{timestamps:true});
const User = Mongo.model("User", UserSchema);

module.exports = User;

  
