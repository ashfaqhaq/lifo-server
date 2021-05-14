const {model,Schema} = require('mongoose');

const userSchema = new Schema({
    username: String, // you can specify required here but we are skipping it rn as we are handling that with GraphQL
    password: String,
    email: String,
    createdAt : String
})

module.exports = model('User',userSchema);