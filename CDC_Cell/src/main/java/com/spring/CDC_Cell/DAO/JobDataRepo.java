package com.spring.CDC_Cell.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.CDC_Cell.Model.JobEntry;
import java.util.List;
import java.time.LocalDate;


public interface JobDataRepo extends JpaRepository<JobEntry, Long> {
	List<JobEntry> getByCompanyName(String CompanyName);
	List<JobEntry> getByEntryDate(LocalDate entryDate);
}
