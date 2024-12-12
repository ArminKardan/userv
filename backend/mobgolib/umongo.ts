// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb


// var MongoClient = require("mongodb").MongoClient
import { MongoClient } from "mongodb";

const uri = process.env.UMONGOURL
const options = {
}

let client = null;
let clientPromise

if (!process.env.UMONGOURL) {
  throw new Error("Please add your U-Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") 
{
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._umongoClientPromise)
  {
    client = new MongoClient(uri, options)
    global._umongoClientPromise = client.connect()
  }
  clientPromise = global._umongoClientPromise
} 
else 
{
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

