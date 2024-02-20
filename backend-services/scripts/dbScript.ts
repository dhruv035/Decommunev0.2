// mongodb.js

const { MongoClient } = require("mongodb");

const abc = async () => {
  
  const uri = ""
  const client = new MongoClient(uri);
  const clientPromise = await client.connect();
  const db = clientPromise.db("Coinvise");
  const data = await db.collection("Collections").aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: "dexu",
          path: "tags",
          
        },
      },
    },
    {
        $project:{
          
            owner:1,
        }
    },
  ]).toArray();
  //const data2 = await db.collection("Collections").list().toArray();
};
abc();
