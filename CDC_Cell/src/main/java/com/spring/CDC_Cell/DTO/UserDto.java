package com.spring.CDC_Cell.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {
	
	private long id;
	private String firstName;
	private String lastName;
	private String email;
	private String userType;
	private String token;
}
