package org.serendipity.party.assembler;

import org.serendipity.party.controller.PartyController;
import org.serendipity.party.entity.Party;
import org.serendipity.party.model.PartyModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class PartyAssembler extends RepresentationModelAssemblerSupport<Party, PartyModel> {

  private final AddressAssembler addressAssembler;
  private final RoleAssembler roleAssembler;

  public PartyAssembler(AddressAssembler addressAssembler, RoleAssembler roleAssembler) {
    // Tell HATEOAS which Controller manages this resource workflow
    super(PartyController.class, PartyModel.class);
    this.addressAssembler = addressAssembler;
    this.roleAssembler = roleAssembler;
  }

  @Override
  public @Nullable PartyModel toModel(Party entity) {

    if (entity == null) {
      return null;
    }

    String publicId = entity.getPublicId();

    if (publicId == null) {
      throw new IllegalStateException("Cannot assemble PartyModel: publicId is missing.");
    }

    // Standard Spring HATEOAS self-link construction using publicId
    // Generates link pointing to: GET /api/parties/{publicId}
    PartyModel model = createModelWithId(publicId, entity);

    // Map publicId to id on the DTO
    model.setId(publicId);
    model.setType(entity.getType());
    model.setLegalEntityType(entity.getLegalEntityType());
    model.setDisplayName(entity.getDisplayName());

    // Map many-to-many child collections using their dedicated assemblers with null filtering
    if (entity.getAddresses() != null) {
      model.setAddresses(entity.getAddresses().stream()
        .map(addressAssembler::toModel)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet()));
    } else {
      model.setAddresses(Collections.emptySet());
    }

    if (entity.getRoles() != null) {
      model.setRoles(entity.getRoles().stream()
        .map(roleAssembler::toModel)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet()));
    } else {
      model.setRoles(Collections.emptySet());
    }

    // Add contextual sub-resource link for party roles
    model.add(linkTo(methodOn(PartyController.class)
      .getPartyRoles(publicId))
      .withRel("roles"));

    return model;
  }

}
