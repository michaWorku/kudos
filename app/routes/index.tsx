import { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Index() {
  return (
    <div className="h-screen w-full bg-slate">
      <h1 className="font-bold text-5xl text-blue-600">Tailwind css works fine</h1>
    </div>
  );
}

