const express=require('express');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
const password='s79Xxqe2t4GBf7k7';


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = "mongodb+srv://nodeJsUser:s79Xxqe2t4GBf7k7@cluster0.ioamv.mongodb.net/nodejsdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true});



app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

  client.connect(err => {
    const collection = client.db("nodejsdb").collection("products");
    //const product={name:"modhu",price:25,quantity:20};
    app.get('/products',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
           res.send(documents);
        })
    })
    app.get('/product/:id',(req,res)=>{
        collection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0]);
         })

    })
     app.post('/addProduct',(req,res)=>{
        const product=req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log("one product added");
            res.send("success");
        })
     })
     app.patch('/update/:id', (req, res) => {
         console.log(req.body);
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
          $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then (result => {
          console.log(result);
        })
      })
     app.delete('/delete/:id',(req,res)=>{
         collection.deleteOne({_id:ObjectID(req.params.id)})
         .then(result=>{
             console.log(result);
         })
     })

    
    // perform actions on the collection object
    console.log("database connected");
    
  });
app.listen(3000);