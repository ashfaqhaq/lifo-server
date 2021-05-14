const {UserInputError} = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../../models/User")
const {SECRET_KEY} = require("../../config")

// 1. import the validators  first
const {
    validateRegisterInput,
    validateLoginInput
  } = require('../../utils/validators');

function generateToken(user){
   return jwt.sign({
        id:user.id,
        email:user.email,
        username: user.username
    },SECRET_KEY,{expiresIn:'1h'});
}
module.exports={
    Mutation:{
        // 2. write the fucntion for login 
        async login(_,{username,password}){

            const {errors,valid} = validateLoginInput(username,password);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
              }
            const user = await User.findOne({username});
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
              }
             
            const match = await bcrypt.compare(password,user.password);
            
            if(!match){
                errors.general = "Invalid Credentials";
                throw new UserInputError('Wrong crendetials', { errors });
            }

            const token = generateToken(user);
            
            return{
                ...user._doc,
               id:user.id,
                token
            };

            },
        
        // register(parent,args,context,info) // parent is used to check the parent data
      async  register(
            _,
            {
                registerInput:{username,email,password,confirmPassword}
            }){
            // TODO validate user Data
           // make sure user doesnt exist already
            // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if(!valid){
          throw new UserInputError("Errors",{errors})
      }

           const user = await User.findOne({username});
           const _email = await User.findOne({email});
           if(user){
                throw new  UserInputError('username is taken',{
                    errors:{
                        username:'The username is taken'
                    }
                })
           }
           else if(_email){
            throw new  UserInputError('email is taken',{
                errors:{
                    email:'The email is taken'
                }
            })
       }
          // hash password for better authentication

          password = await bcrypt.hash(password,12);
          const newUser = new User({
            email,
            username,
            password,
            createdAt:new Date().toISOString()
        }); 
        // saving in the database
        const res = await newUser.save();

     
  
       
        const token = generateToken(res);

        return {
            ...res._doc,
            id: res._id,
            token
          };
          



        }       
     
       
    }
};