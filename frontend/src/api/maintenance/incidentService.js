import api from '../axiosConfig';

const incidentService = {
    // Tickets
    getAllTickets: async () => {
        const response = await api.get('/tickets');
        return response.data;
    },

    getTicketById: async (id) => {
        const response = await api.get(`/tickets/${id}`);
        return response.data;
    },

    createTicket: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    updateTicketStatus: async (id, statusData) => {
        const response = await api.put(`/tickets/${id}/status`, statusData);
        return response.data;
    },

    assignTechnician: async (id, technicianId) => {
        const response = await api.put(`/tickets/${id}/assign/${technicianId}`);
        return response.data;
    },

    // Comments
    getComments: async (ticketId) => {
        const response = await api.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },

    addComment: async (ticketId, content) => {
        const response = await api.post(`/tickets/${ticketId}/comments`, { content });
        return response.data;
    },

    updateComment: async (commentId, content) => {
        const response = await api.put(`/comments/${commentId}`, { content });
        return response.data;
    },

    deleteComment: async (commentId) => {
        await api.delete(`/comments/${commentId}`);
    }
};

export default incidentService;
