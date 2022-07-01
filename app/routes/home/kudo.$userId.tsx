import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Portal } from '~/components/Portal'
import { getUserById } from '~/utils/users.server'


export const loader: LoaderFunction = async ({ request, params }) => {

  const { userId } = params

  if(typeof userId !== 'string') 
    return redirect('/home')

  const recipient = await getUserById(userId)
  return json({ recipient })
}

export default function KudoModal() {

  const {recipient} = useLoaderData()
  return <Portal wrapperId='kudo-modal'>
    <h2> User: {recipient.id} </h2>
  </Portal>
}