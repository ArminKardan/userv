type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "readusers": (T: T) => R } var API: API }
export default async function F(T: null, C: APISession,) {
  
  let r = await udb.collection("users").insertOne({name:"reza",id:10})
  return r
}
