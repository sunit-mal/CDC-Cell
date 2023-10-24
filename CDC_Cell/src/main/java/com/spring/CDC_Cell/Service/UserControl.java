package com.spring.CDC_Cell.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.CDC_Cell.DAO.UserRepository;
import com.spring.CDC_Cell.DTO.SecureUserDataPass;
import com.spring.CDC_Cell.Model.User;

@Service
public class UserControl {
	@Autowired
	private UserRepository repository;

	public boolean validationCheck(String username) {
		String userType = repository.getByEmail(username).getUserType();
		if (userType.equals("ADMINISTRATOR")) {
			return true;
		} else {
			return false;
		}
	}

	public List<SecureUserDataPass> getUser(String username) {
		System.out.println(validationCheck(username));
		List<User> allData = repository.findAll();
		List<SecureUserDataPass> result = new ArrayList<>();
		if (validationCheck(username)) {
			for (User user : allData) {
				if (user.getUserType().equals("ADMINISTRATOR")) {
					continue;
				}
				SecureUserDataPass temp = new SecureUserDataPass(user.getEmail(), user.getUserType());
				result.add(temp);
			}
			return result;
		}
		return null;
	}

	public void updateUserType(String email, String username) {
		User user = repository.getByEmail(email);
		if (validationCheck(username)) {
			user.setUserType(user.getUserType().equals("student") ? "editor" : "student");
			repository.save(user);
		}
	}
	
	public void deleteUser(String email, String username) {
		User user = repository.getByEmail(email);
		if (validationCheck(username)) {
			repository.delete(user);
		}
	}

}
