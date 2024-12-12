import GetWorker from "@/common/worker/GetWorker";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "test": (T: T) => R } var API: API }
export default async function F(T: null, C: CTX,) {


  return { pong: true, cdn: process.env.CDN }
}
