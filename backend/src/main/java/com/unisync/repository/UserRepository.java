package com.unisync.repository;

import com.unisync.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import com.unisync.entity.Role;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    List<User> findByRole(Role role);
}
