package com.unisync.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceCodeException extends RuntimeException {
    public DuplicateResourceCodeException(String message) {
        super(message);
    }
}
