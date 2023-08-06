const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
const PORT = 3000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'wallpapers';

app.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile("/public/index.html", options, (err) => {})
});

app.get("/upload",(req,res) => {
  const options = {
        root: path.join(__dirname)
    };
    res.sendFile("/public/upload.html", options, function (err) {
    });
})

  app.post("/upload",upload.single("img"), async (req,res) => {
  const user = req.body.myName;
  const wppName = req.body.wppname;
  if(user == "" || wppName == "" || req.file.path == ""){
    res.send("porfavor preencha todos campos!")
    return;
  }
    // Use connect method to connect to the server
  await client.connect();
  //console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('w');
  result = await collection.insertOne({name:user,wname:wppName,path:req.file.path})
  if(result.insertedId != null){
    res.send("<script>location.href='/';window.alert('uploaded')</script>")
  }
    //await db.close()
})
app.get("/wallpapers",async (req,res) => {
  await client.connect()
  const db = client.db(dbName);
  const collection = db.collection("w");
  const vect = []
  var stream = collection.find().toArray().then(x => {
   console.log(x)
  res.send(x)
  } )
  //await db.close()
})
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
