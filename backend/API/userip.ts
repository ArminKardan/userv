type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "userip": (T: T) => R } var API: API }
export default async function F(T: null, C: APISession,) {
  
  return C.userip
}
