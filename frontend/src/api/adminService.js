import API from './axiosConfig';

const adminService = {
    getLoginLogs: async () => {
        const response = await API.get('/admin/logins');
        return response.data;
    }
};

export default adminService;
