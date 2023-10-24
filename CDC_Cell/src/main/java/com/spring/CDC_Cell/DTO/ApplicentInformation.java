package com.spring.CDC_Cell.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicentInformation {

	private String email;
	private String fullName;
	private String batch;
	private String dept;
	private String skill;
	private String project;
	private String linkedin;
	private String github;
	private String number;
	private String cv;
}
