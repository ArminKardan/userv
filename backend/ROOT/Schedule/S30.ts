export default async () => {
    setInterval(async () => {
        //    let u = await API.test({id:4})

        let items = await db.collection("config").find({}).project({ _id: 0 }).toArray()
        for (let item of items) {
            if (Object.keys(item).length == 1) {
                global[Object.keys(item)[0]] = item[Object.keys(item)[0]]
            }
        }
    }, 30000)
}
