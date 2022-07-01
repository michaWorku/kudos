import { prisma } from './prisma.server'
import { KudoStyle } from '@prisma/client'

export const createKudo = async (message: string, userId: string, recipientId: string, style: KudoStyle) => {
  await prisma.kudo.create({
    data: {
      // 1 Passes in the message string and style embedded document
      message,
      style,
      // 2 Connects the new kudo to the appropriate author and 
      //   recipient using the ids passed to the function.
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  })
}