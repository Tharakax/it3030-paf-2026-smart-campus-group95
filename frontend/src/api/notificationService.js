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
    },

    /** Get history of notifications sent by the authenticated user */
    getSentNotifications: async () => {
        const response = await api.get('/notifications/sent');
        return response.data;
    },

    /** Update an existing broadcast / custom notification */
    updateBroadcast: async (broadcastId, payload) => {
        const response = await api.put(`/notifications/broadcast/${broadcastId}`, payload);
        return response.data;
    },

    /** Retract a broadcast / custom notification */
    deleteBroadcast: async (broadcastId) => {
        const response = await api.delete(`/notifications/broadcast/${broadcastId}`);
        return response.data;
    }
};

export default notificationService;
