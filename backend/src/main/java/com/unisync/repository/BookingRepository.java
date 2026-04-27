package com.unisync.repository;

import com.unisync.entity.Booking;
import com.unisync.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByResourceIdAndDate(String resourceId, LocalDate date);

    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': 'APPROVED', " +
           "'$or': [ { 'startTime': { '$lt': ?3 }, 'endTime': { '$gt': ?2 } } ] }")
    List<Booking> findOverlappingApprovedBookings(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { '$in': ['APPROVED', 'PENDING'] }, " +
           "'$or': [ { 'startTime': { '$lt': ?3 }, 'endTime': { '$gt': ?2 } } ] }")
    List<Booking> findOverlappingActiveBookings(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
