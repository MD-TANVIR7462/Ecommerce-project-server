const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

// mongodb server

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.v4ogoz2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("SwiftMartDB");
    const SwiftProductCollection = database.collection("SwiftProduct");
    const SwiftUserCollection = database.collection("SwiftUser");
    const bookmarkcollection = database.collection("BookmarkProduct");

    app.get("/", async (req, res) => {
      const Data = await SwiftProductCollection.find().toArray();
      res.send(Data);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await SwiftProductCollection.findOne(query);
      res.send(result);
    });
    app.get("/more/:subcetegory", async (req, res) => {
      const subCetergory = req.params.subcetegory;

      const query = { subcategory: subCetergory };
      const result = await SwiftProductCollection.find(query).toArray();
      res.send(result);
    });

    //user add to cart product
    app.post("/bookmarks", async (req, res) => {
      const bookmarkProduct = req.body;
      const email = req.query.email;
      const query = { oldID: bookmarkProduct.oldID, email: email };

      const existingBookmark = await bookmarkcollection.findOne(query);
      if (existingBookmark) {
        return res.send({ message: "Already Bookmarked" });
      } else {
        const result = await bookmarkcollection.insertOne(bookmarkProduct);
        res.send(result);
      }
    });
    app.delete("/bookmarkDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookmarkcollection.deleteOne(query);
      res.send(result);
    });
    //users all booksmarked products getting
    app.get("/bookmarksAllProducts", async (req, res) => {
      const bookmarkProduct = await bookmarkcollection.find().toArray();
      res.send(bookmarkProduct);
    });

    // creat a user on all users Collections ====>>>
    app.post("/allusers", async (req, res) => {
      const user = req.body;
      const email = user.email;
      const query = { email: email };
      const existingUser = await SwiftUserCollection.findOne(query);
      if (existingUser) {
        return res.send({ status: "Already have an account" });
      } else {
        const result = await SwiftUserCollection.insertOne(user);
        res.send(result);
      }
    });

    app.get("/user", async (req, res) => {
      try {
        const email = req.query.email;
        const query = { email: email };
        const user = await SwiftUserCollection.findOne(query);
        if (user) {
          res.status(200).json(user);
        }
      } catch (error) {
        res.status(500).json({ message: "a error or line 102 ", error });
      }
    });

    //admin added products
    app.post("/addproducts", async (req, res) => {
      const product = req.body;
      const id = product.oldID;
      const existing = { oldID: id };
      if (existing) {
        res.send({ "status: ": "Already Added Into Cart" });
      } else {
        const result = await SwiftProductCollection.insertOne(product);
        res.send(result);
      }
    });

    //admin gets his product
    app.get("/myproducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await SwiftProductCollection.find(query).toArray();
      res.send(result);
    });
    //admin update his product
    app.patch("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateProduct = req.body;
      const updateDoc = {
        $set: {
          price: updateProduct.price,
          brand: updateProduct.brand,
          Quantity: updateProduct.Quantity,
          name: updateProduct.name,
        },
      };
      const result = await SwiftProductCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    //admin delete his product
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const product = { _id: new ObjectId(id) };
      const result = await SwiftProductCollection.deleteOne(product);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

// mongoEND

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
