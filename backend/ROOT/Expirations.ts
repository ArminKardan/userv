
export default async () => {
    setInterval(async () => {
        global.db.collection("transactions").deleteMany({
            status: "waiting",
            expiration: { $lt: new Date().getTime() + global.timeoffset }
        })
    }, 300000)
}
