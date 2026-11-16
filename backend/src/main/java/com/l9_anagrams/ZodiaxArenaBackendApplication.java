package com.l9_anagrams;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ZodiaxArenaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZodiaxArenaBackendApplication.class, args);
	}

}
