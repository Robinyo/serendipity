package org.serendipity.party.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ProblemDetail> handleResourceNotFoundException(ResourceNotFoundException ex) {

    log.warn("Resource not found: {}", ex.getMessage());

    // Using Spring Boot 4.0.1 RFC 7807 Problem Detail format (Recommended)
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
    log.error("An unexpected error occurred during entity processing", ex);

    // Pass a safe message over the wire rather than the raw exception,
    // which may contain internal details we do not want to expose to clients.
    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred. Please try again later."
    );

    problemDetail.setTitle("Internal Server Error");
    problemDetail.setProperty("timestamp", Instant.now());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
  }

  // Field-level validation errors — e.g. a PUT to /accounts/{publicId}
  // or /contacts/{id} where a required field is missing or invalid.
  //
  // Override the parent's handler (same pattern as handleHttpMessageNotReadable
  // below) so we do not create an ambiguous mapping with ResponseEntityExceptionHandler.
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
    MethodArgumentNotValidException ex,
    org.springframework.http.HttpHeaders headers,
    org.springframework.http.HttpStatusCode status,
    org.springframework.web.context.request.WebRequest request) {

    log.warn("Field-level validation failed: {}", ex.getMessage());

    // Convert Spring's default BindException-style response into an
    // RFC 7807 Problem Detail so every error the Party Service returns has
    // the same shape, and clients can identify which field failed and why.
    // This is the field-level visibility that CQRS command validation needs —
    // the DTO annotations (@NotBlank(message = "...")) already carry the intent;
    // this handler surfaces it consistently.
    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
      status,
      "One or more fields failed validation."
    );

    problemDetail.setTitle("Validation Failed");

    // Build a field-level error list from the binding result so the caller
    // can identify the specific field, the message, and the rejected value.
    List<Map<String, Object>> errors = ex.getBindingResult().getFieldErrors().stream()
      .map(fieldError -> {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("field", fieldError.getField());
        error.put("message", fieldError.getDefaultMessage());
        Object rejectedValue = fieldError.getRejectedValue();
        error.put("rejectedValue", rejectedValue != null ? rejectedValue : "null");
        return error;
      })
      .collect(Collectors.toList());

    problemDetail.setProperty("errors", errors);

    return ResponseEntity
      .status(status)
      .contentType(org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON)
      .body(problemDetail);
  }

  // Jackson parse errors (e.g. malformed JSON, unknown fields) — keep
  // these as ProblemDetail too, so the error contract is uniform across
  // validation errors, not-found errors, and parse errors.
  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
    org.springframework.http.converter.HttpMessageNotReadableException ex,
    org.springframework.http.HttpHeaders headers,
    org.springframework.http.HttpStatusCode status,
    org.springframework.web.context.request.WebRequest request) {

    log.error("Unable to read JSON payload", ex);

    // Extract the most useful message — for Jackson errors this is typically
    // something like "Unrecognized field \"organisation\" (class ...)".
    String detail = ex.getCause() != null && ex.getCause().getMessage() != null
      ? ex.getCause().getMessage()
      : (ex.getMessage() != null ? ex.getMessage() : "Malformed request body.");

    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
    problemDetail.setTitle("Malformed Request");
    problemDetail.setProperty("timestamp", Instant.now());

    return ResponseEntity
      .status(status)
      .contentType(org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON)
      .body(problemDetail);
  }

}



/*

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

*/
