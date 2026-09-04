package org.serendipity.party.mapper;

// import jakarta.validation.Valid;
import org.mapstruct.*;
import org.serendipity.party.dto.IndividualUpdateDto;
import org.serendipity.party.dto.NameUpdateDto;
import org.serendipity.party.entity.Individual;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Mapper(
  componentModel = MappingConstants.ComponentModel.SPRING,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL
)
public interface IndividualMapper {

  @Mapping(target = "party.toDate", source = "toDate")

  // Extracts the NameUpdateDto sub-record and delegates string formatting to the stream utility below.
  @Mapping(target = "party.displayName", source = "name", qualifiedByName = "concatNameDtoToDisplayName")

  // Maps every single parameter from the NameUpdateDto sub-record
  // into the Individual's @Embedded Name attribute columns in the database!
  @Mapping(target = "name.title", source = "name.title")
  @Mapping(target = "name.givenName", source = "name.givenName")
  @Mapping(target = "name.preferredName", source = "name.preferredName")
  @Mapping(target = "name.middleName", source = "name.middleName")
  @Mapping(target = "name.familyName", source = "name.familyName")
  @Mapping(target = "name.initials", source = "name.initials")
  @Mapping(target = "name.honorific", source = "name.honorific")
  @Mapping(target = "name.salutation", source = "name.salutation")
  void updateEntityFromDto(IndividualUpdateDto dto, @MappingTarget Individual entity);

  @Named("concatNameDtoToDisplayName")
  default String concatNameDtoToDisplayName(NameUpdateDto nameDto) {

    if (nameDto == null) {
      return "";
    }

    return Stream.of(nameDto.title(), nameDto.givenName(), nameDto.familyName())
      .filter(Objects::nonNull)
      .filter(s -> !s.trim().isEmpty())
      .collect(Collectors.joining(" "));
  }

}

// nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
