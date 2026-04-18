import api from './axiosConfig';

const notificationService = {
    /** Get all notifications for the authenticated user */
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    /** Get only the unread count */
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    /** Mark a single notification as read */
    markAsRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    /** Mark all notifications as read */
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    },

    /** Send a custom notification */
    sendCustomNotification: async (payload) => {
        const response = await api.post('/notifications/send', payload);
        return response.data;
    }
};

export default notificationService;
