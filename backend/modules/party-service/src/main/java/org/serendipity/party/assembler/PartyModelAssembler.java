package org.serendipity.party.assembler;

import org.serendipity.party.controller.PartyController;
import org.serendipity.party.entity.Address;
import org.serendipity.party.entity.Location;
import org.serendipity.party.entity.Party;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.AddressModel;
import org.serendipity.party.model.LocationModel;
import org.serendipity.party.model.PartyModel;
import org.serendipity.party.model.RoleModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import java.util.Set;

import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toSet;

@Component
// @Slf4j
public class PartyModelAssembler extends RepresentationModelAssemblerSupport<Party, PartyModel> {

  public PartyModelAssembler() {
    super(PartyController.class, PartyModel.class);
  }

  @Override
  public PartyModel toModel(Party entity) {

    // log.info("PartyModelAssembler -> toModel()");

    PartyModel model = instantiateModel(entity);

    model.setId(entity.getId());
    model.setType(entity.getType());
    model.setLegalType(entity.getLegalType());
    model.setDisplayName(entity.getDisplayName());
    model.setAddresses(toAddressModel(entity.getAddresses()));
    model.setRoles(toRoleModel(entity.getRoles()));

    // logInfo(model);

    return model;
  }

  private Set<AddressModel> toAddressModel(Set<Address> addresses) {

    // log.info("PartyModelAssembler -> toAddressModel()");

    if (addresses.isEmpty()) {
      return emptySet();
    }

    // log.info("addresses size: {}", addresses.size());

    return addresses.stream()
      .map(address -> AddressModel.builder()
        .id(address.getId())
        .location(toLocationModel(address.getLocation()))
        .name(address.getName())
        .line1(address.getLine1())
        .line2(address.getLine2())
        .city(address.getCity())
        .state(address.getState())
        .postalCode(address.getPostalCode())
        .country(address.getCountry())
        .addressType(address.getAddressType())
        .build())
      .collect(toSet());
  }

  private LocationModel toLocationModel(Location location) {

    return LocationModel.builder()
      .id(location.getId())
      .type(location.getType())
      .displayName(location.getDisplayName())
      .fromDate(location.getFromDate())
      .toDate(location.getToDate())
      .build();
  }

  private Set<RoleModel> toRoleModel(Set<Role> roles) {

    // log.info("PartyModelAssembler -> toRoleModel()");

    if (roles.isEmpty()) {
      return emptySet();
    }

    return roles.stream()
      .map(role -> RoleModel.builder()
        .id(role.getId())
        .role(role.getRole())
        .partyId(role.getPartyId())
        .partyType(role.getPartyType())
        .partyName(role.getPartyName())
        .partyEmail(role.getPartyEmail())
        .partyPhoneNumber(role.getPartyPhoneNumber())
        .relationship(role.getRelationship())
        .reciprocalRole(role.getReciprocalRole())
        .reciprocalPartyId(role.getReciprocalPartyId())
        .reciprocalPartyType(role.getReciprocalPartyType())
        .reciprocalPartyName(role.getReciprocalPartyName())
        .reciprocalPartyEmail(role.getReciprocalPartyEmail())
        .reciprocalPartyPhoneNumber(role.getReciprocalPartyPhoneNumber())
        .build())
      .collect(toSet());

  }

}

/*

  private Set<RoleModel> toRoleModel(Set<Role> roles) {

    log.info("PartyModelAssembler -> toRoleModel()");

    if (roles.isEmpty()) {
      return emptySet();
    }

    log.info("roles size: {}", roles.size());

    Set<RoleModel> roleModels = new HashSet<>();

    for (Role role : roles) {

      log.info("roles id: {}", role.getId());

      roleModels.add(RoleModel.builder()
        .id(role.getId())
        .role(role.getRole())
        .partyId(role.getPartyId())
        .partyType(role.getPartyType())
        .partyName(role.getPartyName())
        .partyEmail(role.getPartyEmail())
        .partyPhoneNumber(role.getPartyPhoneNumber())
        .relationship(role.getRelationship())
        .reciprocalRole(role.getReciprocalRole())
        .reciprocalPartyId(role.getReciprocalPartyId())
        .reciprocalPartyType(role.getReciprocalPartyType())
        .reciprocalPartyName(role.getReciprocalPartyName())
        .reciprocalPartyEmail(role.getReciprocalPartyEmail())
        .reciprocalPartyPhoneNumber(role.getReciprocalPartyPhoneNumber())
        .build());

    }

    log.info("roleModels size: {}", roleModels.size());

    logInfo(roleModels);

    return roleModels;

  }

  protected void logInfo(Object model) {

    try {

      ObjectMapper mapper = new ObjectMapper();

      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
      mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

      mapper.enable(SerializationFeature.INDENT_OUTPUT);

      if (model != null) {
        log.info("model: {}", "\n" + mapper.writeValueAsString(model));
      }

    } catch (JsonProcessingException jpe) {

      log.error("Json Processing Exception: {}", jpe.getLocalizedMessage());
    }

  }

*/
