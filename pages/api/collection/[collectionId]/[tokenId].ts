import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const session = getServerSession(req, res, {});
  const token = getToken({ req });
  if(req.method==="GET")
 {
   res.setHeader( 'Access-Control-Allow-Origin', '*',)
  res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(200).json({});
}
};
