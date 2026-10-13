import api from './axiosInstance';
export const authApi={users:()=>api.get('/auth/all-users'),createUser:data=>api.post('/auth/register-user',data),removeUser:id=>api.delete(`/auth/user/${id}`)};
export const busApi={list:()=>api.get('/buses'),create:data=>api.post('/buses/register',data),mine:()=>api.get('/buses/mine'),setStatus:status=>api.put('/buses/update-status',{status})};
export const studentApi={list:()=>api.get('/attendance/students'),create:data=>api.post('/attendance/add-student',data),update:(id,data)=>api.put(`/attendance/update-student/${id}`,data),remove:id=>api.delete(`/attendance/delete-student/${id}`)};
export const stopApi={list:busId=>api.get(`/stops/bus/${busId}`),create:data=>api.post('/stops/add-stop',data)};
