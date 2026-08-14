package org.serendipity.party.assembler;

import org.serendipity.party.controller.RoleController;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class RoleAssembler extends RepresentationModelAssemblerSupport<Role, RoleModel> {

  RoleAssembler() { super(RoleController.class, RoleModel.class); }

  @Override
  public RoleModel toModel(Role entity) {

    RoleModel model = instantiateModel(entity);

    model.setPublicId(entity.getPublicId());
    model.setRole(entity.getRole());
    model.setPartyPublicId(entity.getPartyPublicId());
    model.setPartyType(entity.getPartyType());
    model.setPartyName(entity.getPartyName());
    model.setPartyEmail(entity.getPartyEmail());
    model.setPartyPhoneNumber(entity.getPartyPhoneNumber());
    model.setRelationship(entity.getRelationship());
    model.setReciprocalRole(entity.getReciprocalRole());
    model.setReciprocalPartyPublicId(entity.getReciprocalPartyPublicId());
    model.setReciprocalPartyType(entity.getReciprocalPartyType());
    model.setReciprocalPartyName(entity.getReciprocalPartyName());
    model.setReciprocalPartyEmail(entity.getReciprocalPartyEmail());
    model.setReciprocalPartyPhoneNumber(entity.getReciprocalPartyPhoneNumber());

    return model;

  }

}
