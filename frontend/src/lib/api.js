import { axiosInstance } from "./axios"

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data
    } catch (error) {
        console.log("Error in getAuthUser", error);
        return null
    }
}

export const signup = async (registerData)=> {
    const response = await axiosInstance.post("/auth/register", registerData);
    return response.data;
};

export const login = async (loginData)=> {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

export const createTask = async (taskData)=> {
    const response = await axiosInstance.post("/task/add-task", taskData)
    return response.data;
}


export async function getSite() {
  const response = await axiosInstance.get("/site/");
  return response.data.sites;
}


export const deleteSite = async (siteId) => {
  const response = await axiosInstance.delete(`/site/${siteId}`);
  return response.data;
}

//gettask
export async function getTask() {
  const response = await axiosInstance.get("/task/");
  return response.data.tasks;
}

//update task
export const updateTask = async ({ taskId, data }) => {
  const res = await axiosInstance.patch(`/task/${taskId}`, data);
  return res.data;
};

//delete task
export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`/task/${taskId}`);
  return response.data;
}

//logout
export const logout = async ()=> {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};