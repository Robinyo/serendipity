package org.serendipity.party.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record OrganisationUpdateDto(
  @NotBlank(message = "Name is mandatory")
  String name,
  String email,
  String phoneNumber,
  String faxNumber,
  String preferredContactMethod,
  String establishmentDate
  // @Valid AddressUpdateDto address
) {}

// List<AddressUpdateDto> addresses