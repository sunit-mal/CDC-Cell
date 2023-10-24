package com.spring.CDC_Cell.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import com.spring.CDC_Cell.Model.User;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
	User getByEmail(String email);
}
