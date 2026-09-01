package org.serendipity.party.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ProblemDetail> handleResourceNotFoundException(ResourceNotFoundException ex) {

    log.warn("Resource not found: {}", ex.getMessage());

    // Using Spring 6 / Boot 3 RFC 7807 Problem Detail format (Recommended)
    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
        HttpStatus.NOT_FOUND,
        ex.getMessage()
    );

    problemDetail.setTitle("Resource Not Found");
    problemDetail.setProperty("timestamp", Instant.now());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);
  }

  // Fallback for unexpected internal server errors
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ProblemDetail> handleGlobalException(Exception ex) {

    // This prints the absolute raw stack error trace to your Docker/Spring terminal logs
    log.error("An unexpected error occurred during entity persistence processing", ex);

    // Pass ex.getMessage() over the wire so it displays in your browser dev console!
    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred. Please try again later."
    );

    problemDetail.setTitle("Internal Server Error Fault");
    problemDetail.setProperty("timestamp", Instant.now());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
  }

  // Overriding the built-in method resolves the ambiguous mapping conflict instantly!
  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
    org.springframework.http.converter.HttpMessageNotReadableException ex,
    org.springframework.http.HttpHeaders headers,
    org.springframework.http.HttpStatusCode status,
    org.springframework.web.context.request.WebRequest request) {

    log.error("Jackson was unable to parse the incoming JSON payload", ex);

    java.util.Map<String, Object> errorDetails = new java.util.LinkedHashMap<>();
    errorDetails.put("timestamp", java.time.Instant.now());
    errorDetails.put("status", status.value());
    errorDetails.put("error", "JSON Parsing Mismatch");

    // Extract the raw nested exception root message (e.g., Unrecognized field "organisation")
    String rootCauseMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
    errorDetails.put("message", rootCauseMessage);

    // Force Spring to return standard JSON universally, bypassing the media type clashing loop!
    return ResponseEntity
      .status(status)
      .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
      .body(errorDetails);
  }

}

/*

  // Fallback for unexpected internal server errors
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ProblemDetail> handleGlobalException(Exception ex) {

    log.error("An unexpected error occurred", ex);

    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred. Please try again later."
    );

    problemDetail.setTitle("Internal Server Error");

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
  }

 */
