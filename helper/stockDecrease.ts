import axios from "axios";
import { toast } from "react-hot-toast";

export const stockDecreasehandler = async (id: string, data: {}) => {
  try {
    await axios.post(`/api/product/updateproduct/${id}`, data);
  } catch (error) {
    toast.error("Something Goes Wrong!");
  }
};
