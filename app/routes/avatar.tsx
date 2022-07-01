// app/routes/avatar.tsx
import { ActionFunction, json } from "@remix-run/node";
import { uploadAvatar } from "~/utils/s3.server";
import { prisma } from "~/utils/prisma.server";
import { requireUserId } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  // 1 Grabs the requesting user's id.
  const userId = await requireUserId(request);
  // 2 Uploads the file past along in the request data.
  const imageUrl = await uploadAvatar(request);

  // 3 Updates the requesting user's profile data with the new profilePicture URL
  await prisma.user.update({
    data: {
      profile: {
        update: {
          profilePicture: imageUrl,
        },
      },
    },
    where: {
      id: userId,
    },
  });

  // 4 Responds to the POST request with the imageUrl variable.
  return json({ imageUrl });
};