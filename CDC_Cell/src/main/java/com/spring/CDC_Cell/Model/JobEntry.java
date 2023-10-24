package com.spring.CDC_Cell.Model;

import java.time.LocalDate;
import java.util.List;

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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class JobEntry {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column
	private String companyName;

	@Column
	private String designation;

	@Column
	private LocalDate entryDate;

	@Column
	private String lastSubDate;

	@Column
	private List<String> applicentList;

	@Column(columnDefinition = "VARCHAR(255) DEFAULT ''")
	private String moreDetails;

}
