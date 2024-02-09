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
  res.status(200).json({});
  return;
};
