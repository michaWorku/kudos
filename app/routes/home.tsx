import { json, LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
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
  const {users} = useLoaderData()
  return <Layout>
    <Outlet/>
    <div className='h-full flex'>
      <UserPanel users={users}/>
    </div>
  </Layout>
}