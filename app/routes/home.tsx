import { LoaderFunction } from '@remix-run/node'
import { Layout } from '~/components/Layout'
import { UserPanel } from '~/components/UserPanel'
import { requireUserId } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Home() {
  return <Layout>
    <div className='h-full flex'>
      <UserPanel/>
    </div>
  </Layout>
}