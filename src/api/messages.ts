import { api } from './client';
import { Message } from '@/types';

interface SearchMessagesResponse {
  messages: Message[];
}

interface MessageListResponse {
  messages: Message[];
}

export const searchMessages = async (query: string, roomId?: string) => {
  const params: any = { q: query, limit: 50 };
  if (roomId) params.room_id = roomId;
  const response = await api.get<SearchMessagesResponse>('/messages/search', { params });
  return response.data.messages;
};

export const getRoomMessages = async (roomId: string, params: { limit?: number, page?: number, around_message_id?: string } = {}) => {
  const response = await api.get<MessageListResponse>(`/rooms/${roomId}/messages`, { 
    params: { limit: 100, ...params } 
  });
  return response.data.messages || [];
};

export const sendMessage = async (roomId: string, content: string) => {
  // Matches your DOC: POST /rooms/{roomID}/messages
  const response = await api.post<Message>(`/rooms/${roomId}/messages`, { content });
  return response.data;
};

export const editMessage = async (roomId: string, messageId: string, content: string) => {
  const response = await api.patch<Message>(`/rooms/${roomId}/messages/${messageId}`, { content });
  return response.data;
};

export const deleteMessage = async (roomId: string, messageId: string) => {
  await api.delete(`/rooms/${roomId}/messages/${messageId}`);
};