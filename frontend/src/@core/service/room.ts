import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class RoomService{
 getRoomsByFloorId = async(floorId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/Floor/${floorId}`);
 }
 getRoomById = async(roomId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/${roomId}`);
 }
}
export default new RoomService();