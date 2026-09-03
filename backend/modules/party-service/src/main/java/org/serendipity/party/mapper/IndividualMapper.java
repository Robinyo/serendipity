package org.serendipity.party.mapper;

import org.mapstruct.*;
import org.serendipity.party.dto.IndividualUpdateDto;
import org.serendipity.party.entity.Individual;

@Mapper(
  componentModel = MappingConstants.ComponentModel.SPRING,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface IndividualMapper {

  @Mapping(target = "name.title", source = "title")
  @Mapping(target = "name.givenName", source = "givenName")
  @Mapping(target = "name.preferredName", source = "preferredName")
  @Mapping(target = "name.middleName", source = "middleName")
  @Mapping(target = "name.familyName", source = "familyName")
  @Mapping(target = "name.initials", source = "initials")
  @Mapping(target = "name.honorific", source = "honorific")
  @Mapping(target = "name.salutation", source = "salutation")

  // MapStruct automatically maps identical names (e.g. sex -> sex, email -> email)
  void updateEntityFromDto(IndividualUpdateDto dto, @MappingTarget Individual entity);

}
