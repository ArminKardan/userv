export default async () => {
    global.Schedule(23,59,59, ()=>{
        global.visitorsD1 = {} as never
    })
}
