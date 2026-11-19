package com.l9_anagrams.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

	/** Nome usato da @SecurityRequirement(name = "bearerAuth") nei controller. */
	public static final String BEARER_AUTH = "bearerAuth";

	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Zodiax Backend")
						.version("1.0")
						.description("API Doc"))
				// Autenticazione Authorization: Bearer <jwt> (contratto §1):
				// abilita il pulsante "Authorize" in Swagger UI
				.components(new Components()
						.addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")));
	}
}
