import { LoaderFunction } from '@remix-run/node'
import { requireUserId } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Home() {
  return <h2>Home Page</h2>
}