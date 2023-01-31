import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  await db.task.create({
    data: {
      name: req.body.name,
      createdAt: req.body.createdAt,
      due: req.body.due,
      description: req.body.description,
      projectId: req.body.projectId,
      ownerId: user.id,
    },
  });

  res.json({ data: { message: "ok" } });
}
