import { json, LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Layout } from '~/components/Layout'
import { UserPanel } from '~/components/UserPanel'
import { requireUserId } from '~/utils/session.server'
import { getOtherUsers, getUser } from '~/utils/users.server'
import { Kudo as IKudo, Prisma, Profile } from '@prisma/client'
import { getFilteredKudos, getRecentKudos } from '~/utils/kudo.server'
import { Kudo } from '~/components/Kudo'
import { SearchBar } from '~/components/SearchBar'
import { RecentBar } from '~/components/RecentBar'

interface KudoWithProfile extends IKudo {
  author: {
    profile: Profile
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const users = await getOtherUsers(userId)
  
 // 1 Pulls out the URL parameters.
 const url = new URL(request.url)
 const sort = url.searchParams.get('sort')
 const filter = url.searchParams.get('filter')

 // 2 Builds a sortOptions object to pass into your Prisma query 
 //   that may vary depending on the data passed in the URL.
 let sortOptions: Prisma.KudoOrderByWithRelationInput = {}
 if (sort) {
   if (sort === 'date') {
     sortOptions = { createdAt: 'desc' }
   }
   if (sort === 'sender') {
     sortOptions = { author: { profile: { firstName: 'asc' } } }
   }
   if (sort === 'emoji') {
     sortOptions = { style: { emoji: 'asc' } }
   }
 }
 // 3 Builds a textFilter object to pass into your Prisma query 
 //   that may vary depending on the data passed in the URL.
 let textFilter: Prisma.KudoWhereInput = {}
 if (filter) {
   textFilter = {
     OR: [
       { message: { mode: 'insensitive', contains: filter } },
       {
         author: {
           OR: [
             { profile: { is: { firstName: { mode: 'insensitive', contains: filter } } } },
             { profile: { is: { lastName: { mode: 'insensitive', contains: filter } } } },
           ],
         },
       },
     ],
   }
 }
 // 4 Updates the getFilteredKudos invocation to include the new filters.
 const kudos = await getFilteredKudos(userId, sortOptions, textFilter)
 
 const recentKudos = await getRecentKudos()

 const user = await getUser(request)
  
 return json({ users, kudos, recentKudos, user })
}

export default function Home() {
  const { users, kudos, recentKudos, user } = useLoaderData()
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <SearchBar profile={user.profile}/>
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo: KudoWithProfile) => (
                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
              ))}
            </div>
            <RecentBar kudos={recentKudos} />
          </div>
        </div>
      </div>
    </Layout>
  )
}