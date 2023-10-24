package com.spring.CDC_Cell.Controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MassageController {
	
	@GetMapping("/massage")
	public ResponseEntity<List<String>> massage(){
		return ResponseEntity.ok(Arrays.asList("First","Second"));
	}
}
