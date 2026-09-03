package org.serendipity.party.dto;

import jakarta.validation.constraints.NotBlank;

public record NameUpdateDto(
  String title,
  @NotBlank(message = "Given name is mandatory")
  String givenName,
  String preferredName,
  String middleName,
  @NotBlank(message = "Family name is mandatory")
  String familyName,
  String initials,
  String honorific,
  String salutation
) {}
