package com.l9_anagrams.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/test")
public class TestController {

	@Operation(summary = "sommario")
	@ApiResponses(value = @ApiResponse(responseCode = "200", description = "descrizione"))
	@GetMapping("/{message}")
	public ResponseEntity<String> getMethodName(
			@PathVariable @Parameter(description = "il messaggio") String message) {
		return ResponseEntity.ok("test " + message);
	}

}
