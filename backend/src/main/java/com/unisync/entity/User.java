package com.unisync.entity;
 
import com.unisync.enums.TicketCategory;
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

    private TicketCategory specialization;
}
