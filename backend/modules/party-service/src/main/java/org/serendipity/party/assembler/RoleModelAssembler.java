package org.serendipity.party.assembler;

import org.serendipity.party.controller.RoleController;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class RoleModelAssembler extends RepresentationModelAssemblerSupport<Role, RoleModel> {

  RoleModelAssembler() { super(RoleController.class, RoleModel.class); }

  @Override
  public RoleModel toModel(Role entity) {

    RoleModel model = instantiateModel(entity);

    model.setId(entity.getId());
    model.setRole(entity.getRole());
    model.setPartyId(entity.getPartyId());
    model.setPartyType(entity.getPartyType());
    model.setPartyName(entity.getPartyName());
    model.setPartyEmail(entity.getPartyEmail());
    model.setPartyPhoneNumber(entity.getPartyPhoneNumber());
    model.setRelationship(entity.getRelationship());
    model.setReciprocalRole(entity.getReciprocalRole());
    model.setReciprocalPartyId(entity.getReciprocalPartyId());
    model.setReciprocalPartyType(entity.getReciprocalPartyType());
    model.setReciprocalPartyName(entity.getReciprocalPartyName());
    model.setReciprocalPartyEmail(entity.getReciprocalPartyEmail());
    model.setReciprocalPartyPhoneNumber(entity.getReciprocalPartyPhoneNumber());

    return model;

  }

}
