package com.spring.CDC_Cell.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Information {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private String email;
	
	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String fullName;

	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String batch;

	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String dept;
	
	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String skill;
	
	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String project;
	
	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String linkedin;
	

	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String github;

	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String number;
}
