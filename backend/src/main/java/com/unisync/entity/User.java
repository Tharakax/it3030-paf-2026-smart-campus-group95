package com.unisync.entity;
 
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
 
    @Id
    private String id;
 
    private String email;
 
    private String name;
 
    private String googleId;
 
    private String profilePictureUrl;
 
    private Role role;
}
