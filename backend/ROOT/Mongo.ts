
import umongodblib from '../mobgolib/umongo'
import mongodblib from '../mobgolib/mongo'


export default async () => {

    if (process.env.MONGOURL && !global.mongo) {
        global.mongo = await mongodblib
        global.db = global.mongo.db("qepal")
        let owneruser = await global.db.collection("users").findOne({});
        if (owneruser)
            console.log("Connection with Mongo DB was SUCCESSFULL...")
    }

    if (process.env.UMONGOURL && !global.umongo) {
        global.umongo = await umongodblib
        global.udb = global.umongo.db(process.env.UMONGODB_DB)
    }

    if (!global.ObjectId) {
        let mongo = await (await import("mongodb")).ObjectId
        global.ObjectId = mongo
    }
    if (!global.Long) {
        global.Long = await (await import("mongodb")).Long
    }

    Object.defineProperty(Array.prototype, 'includesid', {
        value: function (objid) {
            if (!objid) {
                return false
            }
            return !!this.find(obj => obj.equals(objid))
        }
    });

}
