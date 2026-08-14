package org.serendipity.party.assembler;

import org.serendipity.party.controller.PartyController;
import org.serendipity.party.entity.Party;
import org.serendipity.party.model.PartyModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class PartyAssembler extends RepresentationModelAssemblerSupport<Party, PartyModel> {

  // Inject child model assemblers to avoid direct entity mapping leaks
  private final AddressAssembler addressAssembler;
  private final RoleAssembler roleAssembler;

  public PartyAssembler(AddressAssembler addressAssembler, RoleAssembler roleAssembler) {

    // Tell HATEOAS which Controller manages this resource workflow
    super(PartyController.class, PartyModel.class);
    this.addressAssembler = addressAssembler;
    this.roleAssembler = roleAssembler;
  }

  @Override
  public PartyModel toModel(Party entity) {

    if (entity == null) {
      return null;
    }

    // Initialize the base DTO model and auto-inject the HATEOAS self-link
    // Behind the scenes, instantiateModel uses the publicId path variable defined below
    PartyModel model = createModelWithId(entity.getPublicId(), entity);

    // Map standard properties from the entity to the DTO
    model.setPublicId(entity.getPublicId());
    model.setType(entity.getType());
    model.setLegalEntityType(entity.getLegalEntityType());
    model.setDisplayName(entity.getDisplayName());

    // Map many-to-many child collections using their dedicated assemblers
    if (entity.getAddresses() != null) {
      model.setAddresses(entity.getAddresses().stream()
          .map(addressAssembler::toModel)
          .collect(Collectors.toSet()));
    } else {
      model.setAddresses(Collections.emptySet());
    }

    if (entity.getRoles() != null) {
      model.setRoles(entity.getRoles().stream()
          .map(roleAssembler::toModel)
          .collect(Collectors.toSet()));
    } else {
      model.setRoles(Collections.emptySet());
    }

    // Add auxiliary contextual links if needed (e.g., direct access to this party's roles)
    model.add(linkTo(methodOn(PartyController.class)
        .getPartyRoles(entity.getPublicId()))
        .withRel("roles"));

    return model;
  }

}

/*

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
public class PartyModelAssembler extends RepresentationModelAssemblerSupport<Party, PartyModel> {

  public PartyModelAssembler() {
    super(PartyController.class, PartyModel.class);
  }

  @Override
  public PartyModel toModel(Party entity) {

    // log.info("PartyModelAssembler -> toModel()");

    PartyModel model = instantiateModel(entity);

    model.setPublicId(entity.getPublicId());
    model.setType(entity.getType());
    model.setLegalEntityType(entity.getLegalEntityType());
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

*/