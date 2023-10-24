package com.spring.CDC_Cell.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.spring.CDC_Cell.DTO.SignUpDto;
import com.spring.CDC_Cell.DTO.UserDto;
import com.spring.CDC_Cell.Model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
//	@Mapping(target = "token", ignore = true)
	UserDto toUserDto(User user);
	
//	@Mapping(target = "id", ignore = true)
	@Mapping(target = "password", ignore = true)
	User signUpToUser(SignUpDto signUpDto);
	
}