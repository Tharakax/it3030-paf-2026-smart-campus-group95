package com.unisync.repository;

import com.unisync.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    boolean existsByResourceCode(String resourceCode);

    Optional<Resource> findByResourceCode(String resourceCode);
}
