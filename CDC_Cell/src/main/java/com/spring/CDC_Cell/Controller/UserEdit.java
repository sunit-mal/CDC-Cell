package com.spring.CDC_Cell.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.CDC_Cell.DTO.SecureUserDataPass;
import com.spring.CDC_Cell.Service.UserControl;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/userControl")
public class UserEdit {

	@Autowired
	private UserControl service;

	@GetMapping(value = "/getUsers/{username}")
	public ResponseEntity<List<SecureUserDataPass>> allUser(HttpServletRequest request, @PathVariable String username) {
		if (username != null) {
			List<SecureUserDataPass> ressponseData = service.getUser(username);
			if (ressponseData == null) {
				SecureUserDataPass data = new SecureUserDataPass("", "");
				List<SecureUserDataPass> errordata = new ArrayList<>();
				errordata.add(data);
				return new ResponseEntity<List<SecureUserDataPass>>(errordata, HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<List<SecureUserDataPass>>(ressponseData, HttpStatus.OK);
		} else {
			SecureUserDataPass data = new SecureUserDataPass("", "");
			List<SecureUserDataPass> errordata = new ArrayList<>();
			errordata.add(data);
			return new ResponseEntity<List<SecureUserDataPass>>(errordata, HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/change/{username}")
	public String allUser(@PathVariable String username, @RequestBody SecureUserDataPass data) {
		service.updateUserType(data.getUsername(), username);
		return "Process Done";
	}

	@DeleteMapping("/delete/{username}")
	public String deleteUser(@PathVariable String username, @RequestBody SecureUserDataPass data) {
		service.deleteUser(data.getUsername(), username);
		return "User Successfully Remove";
	}
}
