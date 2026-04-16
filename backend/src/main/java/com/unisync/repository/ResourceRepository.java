package com.unisync.repository;

import com.unisync.entity.Resource;
import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    boolean existsByResourceCode(String resourceCode);

    Optional<Resource> findByResourceCode(String resourceCode);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByDepartment(Department department);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByBookable(Boolean bookable);

    long countByType(ResourceType type);
}
