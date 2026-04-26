package com.unisync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class UnisyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnisyncApplication.class, args);
	}

}
