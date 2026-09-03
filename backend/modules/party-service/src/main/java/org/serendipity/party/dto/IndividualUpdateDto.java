package org.serendipity.party.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record IndividualUpdateDto(
  String title,
  @NotBlank(message = "Given name is mandatory")
  String givenName,
  String preferredName,
  String middleName,
  @NotBlank(message = "Family name is mandatory")
  String familyName,
  String initials,
  String honorific,
  String salutation,
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
  List<AddressUpdateDto> addresses
) {}

// List<RoleUpdateDto> roles
// legalEntityType
