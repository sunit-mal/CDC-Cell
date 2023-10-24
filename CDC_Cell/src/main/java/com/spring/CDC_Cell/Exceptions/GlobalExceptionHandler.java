package com.spring.CDC_Cell.Exceptions;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.auth0.jwt.exceptions.TokenExpiredException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus()
	public Map<String, String> handleValidationErrors(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		return errors;
	}

	@ExceptionHandler(IOException.class)
	@ResponseStatus
	public Map<String, String> OperationFail(IOException ex) {
		
		Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put(ex.getLocalizedMessage(), ex.getMessage()); // Extract and store the error message
        return errorResponse;
	}
	
	@ExceptionHandler(TokenExpiredException.class)
    @ResponseStatus()
    public Map<String, String> handleTokenExpiredException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message ", ex.getMessage());
        return errorResponse;
    }
}
