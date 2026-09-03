package org.serendipity.party.mapper;

import org.mapstruct.*;
import org.serendipity.party.dto.OrganisationUpdateDto;
import org.serendipity.party.entity.Organisation;

@Mapper(
  componentModel = MappingConstants.ComponentModel.SPRING,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL
)
public interface OrganisationMapper {

  @Mapping(target = "party.displayName", source = "name")
  @Mapping(target = "party.toDate", source = "toDate")

  // MapStruct automatically maps identical names (e.g. name -> name, email -> email)
  void updateEntityFromDto(OrganisationUpdateDto dto, @MappingTarget Organisation entity);

}

// nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE