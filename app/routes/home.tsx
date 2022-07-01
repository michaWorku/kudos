import { json, LoaderFunction } from '@remix-run/node'
import { Layout } from '~/components/Layout'
import { UserPanel } from '~/components/UserPanel'
import { requireUserId } from '~/utils/session.server'
import { getOtherUsers } from '~/utils/users.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const users = await getOtherUsers(userId)
  return json({ users })
}

export default function Home() {
  return <Layout>
    <div className='h-full flex'>
      <UserPanel/>
    </div>
  </Layout>
}