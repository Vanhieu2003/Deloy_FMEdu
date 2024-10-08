import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ResponsibleGroupRoomService {
 
  createResponsibleGroups = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/ResponsibleGroups`, data); 
  };


  getAllResponsibleGroups = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/ResponsibleGroups`);
  }

  getResponsibleGroupbyId = async (id:string)=>{
    return axios.get(`${API_ENDPOINT}/api/ResponsibleGroups/${id}`);
  }

  updateResponsibleGroup = async (id:string ,data:object)=>{
    return axios.put(`${API_ENDPOINT}/api/ResponsibleGroups/${id}`,data);
  }
}

export default new ResponsibleGroupRoomService();
