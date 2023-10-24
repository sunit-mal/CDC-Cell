package com.spring.CDC_Cell.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.CDC_Cell.Model.Information;
//import java.util.List;

public interface InformationRepo extends JpaRepository<Information, Long> {
	Information findByEmail(String email);
}
