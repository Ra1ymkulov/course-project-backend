import { prisma } from "../../lib/prisma";

export const createChat = async (
  title: string,
  userIds: string[],
  avatar?: string
) => {
  const uniqueIds = [...new Set(userIds)];
  const chat = await prisma.chat.create({
    data: {
      title,
      avatar,
      isGroup: true,
      users: {
        create: uniqueIds.map((id) => ({ userId: id })),
      },
    },
    include: {
      users: true,
    },
  });
  return chat;
};

export const getMyChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { users: { some: { userId } } },
    include: {
      users: { include: { user: true } },
      messages: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  });
};
export const getAllChats = async () => {
  return prisma.chat.findMany();
};

export const sendMessage = async (
  chatId: string,
  userId: string,
  text: string
) => {
  return prisma.message.create({
    data: { chatId, userId, text },
    include: { user: true },
  });
};

export const deleteChat = async (chatId: string) => {
  await prisma.message.deleteMany({ where: { chatId } });
  return prisma.chat.delete({ where: { id: chatId } });
};
