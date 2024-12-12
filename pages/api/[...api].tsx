// This is an example of how to access a session from an API route
import type { NextApiRequest, NextApiResponse } from "next"
import APIVerify from '@/backend/APIVerify'
import rolecheck from "@/common/rolecheck"
import { createGzip } from 'zlib';
export default async (req: NextApiRequest, res: NextApiResponse) => {


  var { post, userip, email, uid, role, body, follows } = await APIVerify(req, res);
  // try {
    
    let ctx: CTX = {
      req, res, email, uid, role: (check) => rolecheck(check, role), post, userip, follows
    }
    if(body)
    {
      delete body.passcode
    }
    
    let result = await (await import(`@/backend/API/${(req.query.api as Array<string>).join("/")}`)).default(body, ctx);
    if (result != null) {

      const gzip = createGzip();
      res.writeHead(200, {'Content-Encoding': 'gzip' })
      gzip.pipe(res);
      gzip.write(QSON.stringify(result));
      gzip.end();
    }
  // } catch(e) {
  //   // res.writeHead(200, {'Content-Encoding': 'gzip' })
  //   res.send(QSON.stringify({ code: -1000, e }))
  // }
}
