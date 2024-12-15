type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "insertuser": (T: T) => R } var API: API }
export default async function F(T: null, C: APISession,) {
  
  let u = await udb.collection("users")

  return JSON.stringify(u.find({}).project({_id:-1}).toArray())
}
