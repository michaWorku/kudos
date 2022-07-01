import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'


export const loader: LoaderFunction = async ({ request, params }) => {

  const { userId } = params
  return json({ userId })
}

export default function KudoModal() {
  
  const data = useLoaderData()
  return <h2> User: {data.userId} </h2>
}