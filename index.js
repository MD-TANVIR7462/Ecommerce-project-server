const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config();
// middleware
app.use(cors())
app.use(express.json())


// mongodb server

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.v4ogoz2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("SwiftMartDB");
    const SwiftProductCollection  = database.collection("SwiftProduct");
    const SwiftUserCollection = database.collection("SwiftUser");

app.get("/",async(req,res)=>{
   const Data = await SwiftProductCollection.find().toArray()
   res.send(Data)

})

app.get("/details/:id",async(req,res)=>{
   const id = req.params.id
   const query = {_id : new ObjectId(id)}
   const result = await SwiftProductCollection.findOne(query)
   res.send(result)

})
app.get("/more/:subcetegory",async(req,res)=>{
  const subCetergory = req.params.subcetegory
  // console.log(subCetergory)
  const query = {subcategory : subCetergory}
  const result = await SwiftProductCollection.find(query).toArray()
  res.send(result)
})


//users Collections ====>>>
app.post("/allusers",async(req,res)=>{
  const user = req.body
  const result = await SwiftUserCollection.insertOne(user)
  res.send(result)


})
//Post addproducts
app.post("/addproducts",async(req,res)=>{
const product = req.body
// console.log(product);
const result = await SwiftProductCollection.insertOne(product)
res.send(result);

})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);



// mongoEND

 
 app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
 })
