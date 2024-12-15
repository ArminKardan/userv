// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb


var MongoClient = require("mongodb").MongoClient

const uri = process.env.MONGOURL
let client = null;
let clientPromise = null

if (process.env.MONGOURL) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  }
  else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export default clientPromise

