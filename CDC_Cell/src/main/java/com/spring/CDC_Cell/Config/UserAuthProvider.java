package com.spring.CDC_Cell.Config;

import java.util.Date;
import java.util.Base64;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.spring.CDC_Cell.DTO.UserDto;
import com.spring.CDC_Cell.Service.UserService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Component
public class UserAuthProvider {

	@Value("${security.jwt.token.secret-key:secret-key}")
	private String secretKey;
	
	@Autowired
	private UserService userService;
	
	@PostConstruct
	protected void init() {
		secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
	}
	
	public String createToken(String email) {
		Date now = new Date();
		Date validity = new Date(now.getTime() + 3_600_000); 
		
		return JWT.create()
				.withIssuer(email)
				.withIssuedAt(now)
				.withExpiresAt(validity)
				.sign(Algorithm.HMAC256(secretKey));
	}
	
	public Authentication validateToken(String token) {
		JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();		
		DecodedJWT decoded = verifier.verify(token);		
		UserDto user = userService.findByEmail(decoded.getIssuer());
		return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
	}
	
}
