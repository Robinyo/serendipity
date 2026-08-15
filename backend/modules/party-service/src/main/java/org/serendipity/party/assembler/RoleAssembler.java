package org.serendipity.party.assembler;

import org.serendipity.party.controller.RoleController;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class RoleAssembler extends RepresentationModelAssemblerSupport<Role, RoleModel> {

  public RoleAssembler() {
    super(RoleController.class, RoleModel.class);
  }

  @Override
  public @Nullable RoleModel toModel(Role entity) {

    if (entity == null) {
      return null;
    }

    String publicId = entity.getPublicId();

    if (publicId == null) {
      throw new IllegalStateException("Cannot assemble RoleModel: publicId is missing.");
    }

    // Standard Spring HATEOAS self-link construction using publicId
    // Generates link pointing to: GET /api/roles/{publicId}
    RoleModel model = createModelWithId(publicId, entity);

    // Map public UUIDs to clean model properties
    model.setId(publicId);
    model.setPartyId(entity.getPartyPublicId());
    model.setReciprocalPartyId(entity.getReciprocalPartyPublicId());

    // Map standard properties
    model.setRole(entity.getRole());
    model.setPartyType(entity.getPartyType());
    model.setPartyName(entity.getPartyName());
    model.setPartyEmail(entity.getPartyEmail());
    model.setPartyPhoneNumber(entity.getPartyPhoneNumber());
    model.setRelationship(entity.getRelationship());
    model.setReciprocalRole(entity.getReciprocalRole());
    model.setReciprocalPartyType(entity.getReciprocalPartyType());
    model.setReciprocalPartyName(entity.getReciprocalPartyName());
    model.setReciprocalPartyEmail(entity.getReciprocalPartyEmail());
    model.setReciprocalPartyPhoneNumber(entity.getReciprocalPartyPhoneNumber());

    return model;
  }

}