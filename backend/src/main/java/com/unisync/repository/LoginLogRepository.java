package com.unisync.repository;

import com.unisync.entity.LoginLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginLogRepository extends MongoRepository<LoginLog, String> {
    List<LoginLog> findAllByOrderByTimestampDesc();
}
