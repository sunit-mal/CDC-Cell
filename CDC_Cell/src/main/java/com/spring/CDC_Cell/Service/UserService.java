package com.spring.CDC_Cell.Service;

import java.nio.CharBuffer;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.spring.CDC_Cell.DAO.UserRepository;
import com.spring.CDC_Cell.DTO.*;
import com.spring.CDC_Cell.Exceptions.AppException;
import com.spring.CDC_Cell.Mapper.UserMapper;
import com.spring.CDC_Cell.Model.User;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private PasswordEncoder passwordEncoder;

	public UserDto findByEmail(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
		return userMapper.toUserDto(user);
	}

	public UserDto UserLogin(CredentialsDto credentialsDto) {
		User user = userRepository.findByEmail(credentialsDto.getEmail())
				.orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
		if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())) {			
			return userMapper.toUserDto(user);
		}
		throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
	}

	public UserDto register(SignUpDto signUpDto) {
		Optional<User> optionalUser = userRepository.findByEmail(signUpDto.getEmail());
		if (optionalUser.isPresent()) {
			throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
		}
		User user = userMapper.signUpToUser(signUpDto);
		user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.getPassword())));
		User savedUser = userRepository.save(user);
		return userMapper.toUserDto(savedUser);
	}
}
