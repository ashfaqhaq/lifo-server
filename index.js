const {ApolloServer, gql, PubSub} = require('apollo-server');
const mongoose = require("mongoose")

const {MONGODB} = require("./config.js") 

const typeDefs= require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000;



const server = new ApolloServer({
    typeDefs,  // can be written as typeDefs:typeDefs but ES6 infers on it
    resolvers,  // Same as above ^
    context: ({req})=>({req, pubsub})
})

mongoose.connect(MONGODB,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex: true})
  .then(()=>{
    console.log("mongodb connected")
    return server.listen({port:5000});
  })
 .then(res=>{
    console.log(`Server is running at ${res.url}`)
  })
  .catch(err => {
    console.error(err)
  });

// Go and refer the node modules, we can observe express is already working as backend for Apollo.
// run script using node index 
