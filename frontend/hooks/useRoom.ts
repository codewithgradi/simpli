import { PaginatedObject } from "@/services/notificationService";
import { PostRoom, roomService, UpdateRoom } from "@/services/roomService";
import { useState } from "react";

export function useRoom() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  // in your useRoom hook
const getRooms = async (companyId: string, query?:PaginatedObject) => {
  setLoading(true);
  setError(null);
  try {
    
    const rooms = await roomService.getAll(companyId,  {...query, isRoomAvailable : true});
    return rooms;
  } catch (err: any) {
    setError(err.message || "Could not get rooms");
    return null;
  } finally {
    setLoading(false);
  }
};
const getRoomsPrivate = async (query?:PaginatedObject)=>{
  setLoading(true);
  setError(null);
  try {
    const rooms = await roomService.getAllPrivate(query);
    return rooms;
  } catch (err: any) {
    setError(err.message || "Could not get rooms");
    return null;
  } finally {
    setLoading(false);
  }
};

  const getRoom = async () => {
    setLoading(true);
    setError(null);

    try {
      const rooms = await roomService.getOne();
      return rooms;
    } catch (err: any) {
      setError(err.message || "Could not get room");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (data: UpdateRoom, id:number) => {
    setLoading(true);
    setError(null);
    try {
      var res = await roomService.update(data, id);
      return res;
    } catch (err: any) {
      setError(err.message || "Could not updated room");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (data: PostRoom) => {
    setLoading(true);
    setError(null);
    try {
      var res = await roomService.create(data);
      return res;
    } catch (err: any) {
      setError(err.message || "Could not create  room");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    getRooms,
    updateRoom,
    createRoom,
    getRoomsPrivate,
    loading,
    error,
    getRoom,
  };
}
