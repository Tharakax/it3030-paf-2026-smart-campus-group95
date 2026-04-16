package com.unisync.service;

import com.unisync.dto.BookingRequestDTO;
import com.unisync.dto.BookingResponseDTO;
import com.unisync.enums.BookingStatus;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO request, String userId);
    List<BookingResponseDTO> getUserBookings(String userId);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO updateBookingStatus(String bookingId, BookingStatus status, String rejectionReason);
    BookingResponseDTO cancelBooking(String bookingId, String userId);
    BookingResponseDTO getBookingById(String bookingId);
    void deleteBooking(String bookingId);
}
