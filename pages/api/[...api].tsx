// This is an example of how to access a session from an API route
import type { NextApiRequest, NextApiResponse } from "next"
import APIVerify from '@/backend/APIVerify'
import rolecheck from "@/common/rolecheck"
import { createGzip } from 'zlib';
export default async (req: NextApiRequest, res: NextApiResponse) => {

 let pr = await APIVerify(req, res);

  if (pr.body) {
    delete pr.body.passcode
  }

  let result = await (await import(`@/backend/API/${(req.query.api as Array<string>).join("/")}`)).default(pr.body, pr);
  if (result != null) {

    const gzip = createGzip();
    res.writeHead(200, { 'Content-Encoding': 'gzip' })
    gzip.pipe(res);
    gzip.write(QSON.stringify(result));
    gzip.end();
  }
  // } catch(e) {
  //   // res.writeHead(200, {'Content-Encoding': 'gzip' })
  //   res.send(QSON.stringify({ code: -1000, e }))
  // }
}
