import { api } from './client';
import { Room } from '@/types';

interface RoomListResponse {
  rooms: Room[];
}

export const getRooms = async (query?: string) => {
  const params = query ? { q: query, limit: 20 } : { limit: 50 };
  const response = await api.get<RoomListResponse>('/rooms', { params });
  return response.data?.rooms || [];
};

// FIX: Updated signature to accept creatorId
export const createRoom = async (name: string, creatorId: string, description?: string) => {
  const payload = {
    name,
    is_group: true,       // Required by your doc
    creator_id: creatorId, // Required by your doc
    member_ids: [creatorId], // Required by your doc (must include creator)
    description: description
  };

  const response = await api.post<Room>('/rooms', payload);
  return response.data;
};

export const addRoomMember = async (roomId: string, userId: string, role: 'ADMIN' | 'MEMBER' = 'MEMBER') => {
  // Matches DOC: POST /rooms/{roomID}/members
  const response = await api.post(`/rooms/${roomId}/members`, { 
    user_id: userId, 
    role 
  });
  return response.data;
};

export const createDirectRoom = async (peerUserId: string) => {
  const response = await api.post<Room>('/rooms/direct', { peer_user_id: peerUserId });
  return response.data;
};

export const getRoomMembers = async (roomId: string) => {
  const response = await api.get<any[]>(`/rooms/${roomId}/members`);
  return response.data;
};

export const deleteRoom = async (roomId: string) => {
  await api.delete(`/rooms/${roomId}`);
};