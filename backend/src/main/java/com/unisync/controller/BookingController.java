package com.unisync.controller;

import com.unisync.dto.BookingRequestDTO;
import com.unisync.dto.BookingResponseDTO;
import com.unisync.enums.BookingStatus;
import com.unisync.security.UserPrincipal;
import com.unisync.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.createBooking(request, principal.getUser().getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getUserBookings(principal.getUser().getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        String statusStr = statusUpdate.get("status");
        BookingStatus status = BookingStatus.valueOf(statusStr);
        String reason = statusUpdate.get("rejectionReason");

        // If it's a cancellation, check ownership
        if (status == BookingStatus.CANCELLED) {
            return ResponseEntity.ok(bookingService.cancelBooking(id, principal.getUser().getId()));
        }

        // Only Admin can Approve/Reject
        // We'll rely on PreAuthorize for Admin checks on non-cancel statuses or handle in service
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
