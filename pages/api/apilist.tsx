// This is an example of how to access a session from an API route
import type { NextApiRequest, NextApiResponse } from "next"
import APIVerify from '@/backend/APIVerify'
import Lorem from '@/frontend/components/qecomps/Lorem'

import path from "path"


export default async (req: NextApiRequest, res: NextApiResponse) => {
  var r = await APIVerify(req, res);

  let list = getAllFiles("./backend/API", '')
  res.send(list)
}


function getAllFiles(dirPath, rootPath) {
  let results = [];
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = fullPath.replace(rootPath, '');
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllFiles(fullPath, rootPath));
    } else {
      results.push(relativePath.replace(/\\/g, '/').slice(7).slice(0, -3).replace("/API/", "/api/"));
    }
  });
  return results;
}
