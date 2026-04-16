import api from './axiosConfig';

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status, rejectionReason = null) => {
    const response = await api.patch(`/bookings/${id}/status`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/status`, {
      status: 'CANCELLED'
    });
    return response.data;
  }
};

export default bookingService;
