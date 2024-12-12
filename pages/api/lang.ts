
export default async (req: NextApiRequest, res: NextApiResponse) => {

  res.send(global.langs[req.query.lang.toString() || "fa"])
}

