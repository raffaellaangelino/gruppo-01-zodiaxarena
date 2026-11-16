package com.l9_anagrams.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("securitydisabled")
public class SecurityDisabledWarning {

	private static final Logger log = LoggerFactory.getLogger(SecurityDisabledWarning.class);

	@Bean
	CommandLineRunner warnSecurityDisabled() {
		return args -> log.warn("!!! SECURITY IS DISABLED (profile 'securitydisabled') !!!");
	}
}