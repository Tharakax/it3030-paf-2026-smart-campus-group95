package com.unisync.security;

import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");
        String picture = oAuth2User.getAttribute("picture");

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user with any new info from Google if necessary
            if (!user.getGoogleId().equals(googleId)) {
                user.setGoogleId(googleId);
            }
            user.setProfilePictureUrl(picture);
            user = userRepository.save(user);
        } else {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .googleId(googleId)
                    .profilePictureUrl(picture)
                    .role(Role.USER) // Default role for newly registered users
                    .build();
            user = userRepository.save(user);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }
}
