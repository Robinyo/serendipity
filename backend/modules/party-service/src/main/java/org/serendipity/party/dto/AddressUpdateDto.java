package org.serendipity.party.dto;

public record AddressUpdateDto(
  String name,
  String line1,
  String line2,
  String city,
  String state,
  String postalCode,
  String country,
  String addressType
) {}
