package com.unisync.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidResourceAvailabilityException extends RuntimeException {
    public InvalidResourceAvailabilityException(String message) {
        super(message);
    }
}
