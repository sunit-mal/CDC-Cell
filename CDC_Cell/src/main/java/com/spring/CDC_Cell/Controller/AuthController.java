package com.spring.CDC_Cell.Controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.CDC_Cell.Config.UserAuthProvider;
import com.spring.CDC_Cell.DTO.CredentialsDto;
import com.spring.CDC_Cell.DTO.SignUpDto;
import com.spring.CDC_Cell.DTO.UserDto;
import com.spring.CDC_Cell.Service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping
public class AuthController {

	@Autowired
    private UserService userService;
	
	@Autowired
    private UserAuthProvider userAuthenticationProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        UserDto userDto = userService.UserLogin(credentialsDto);
        userDto.setToken(userAuthenticationProvider.createToken(userDto.getEmail()));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto user) {
        UserDto createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(user.getEmail()));
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }
    
}