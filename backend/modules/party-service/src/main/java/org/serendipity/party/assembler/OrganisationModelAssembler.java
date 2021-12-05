package org.serendipity.party.assembler;

import org.serendipity.party.controller.OrganisationController;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.OrganisationModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class OrganisationModelAssembler extends RepresentationModelAssemblerSupport<Organisation, OrganisationModel> {

  @Autowired
  private PartyModelAssembler partyModelAssembler;

  public OrganisationModelAssembler() {
    super(OrganisationController.class, OrganisationModel.class);
  }

  @Override
  public OrganisationModel toModel(Organisation entity) {

    OrganisationModel model = instantiateModel(entity);

    model.setId(entity.getId());
    model.setParty(partyModelAssembler.toModel(entity.getParty()));

    model.setName(entity.getName());
    model.setEmail(entity.getEmail());
    model.setPhoneNumber(entity.getPhoneNumber());

    return model;

  }


}
