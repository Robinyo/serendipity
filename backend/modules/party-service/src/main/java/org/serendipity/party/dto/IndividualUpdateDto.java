package org.serendipity.party.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record IndividualUpdateDto(
  @Valid NameUpdateDto name,
  String jobTitle,
  String sex,
  String gender,
  String email,
  String phoneNumber,
  String faxNumber,
  String preferredContactMethod,
  String electorate,
  String dateOfBirth,
  String placeOfBirth,
  String countryOfBirth,
  String dateOfDeath,
  String placeOfDeath,
  String countryOfDeath,
  String toDate
  // @Valid AddressUpdateDto address
) {}

// List<AddressUpdateDto> addresses
// List<RoleUpdateDto> roles
// legalEntityType
