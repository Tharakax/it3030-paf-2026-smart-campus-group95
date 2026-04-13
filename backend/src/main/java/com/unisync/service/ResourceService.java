package com.unisync.service;

import com.unisync.entity.Resource;
import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    List<Resource> getAllResources();
    Resource getResourceById(String id);
    Resource updateResource(String id, Resource resource);
    void deleteResource(String id);
}
