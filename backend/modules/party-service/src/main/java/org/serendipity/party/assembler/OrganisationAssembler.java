package org.serendipity.party.assembler;

import org.serendipity.party.controller.OrganisationController;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.OrganisationModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class OrganisationAssembler extends RepresentationModelAssemblerSupport<Organisation, OrganisationModel> {

  private final PartyAssembler partyAssembler;

  public OrganisationAssembler(PartyAssembler partyAssembler) {
    // Tell HATEOAS which Controller manages this resource workflow
    super(OrganisationController.class, OrganisationModel.class);
    this.partyAssembler = partyAssembler;
  }

  @Override
  public OrganisationModel toModel(Organisation entity) {

    if (entity == null) {
      return null;
    }

    var party = entity.getParty();
    if (party == null || party.getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble OrganisationModel: Parent Party or publicId is missing.");
    }

    String partyPublicId = party.getPublicId();

    // Standard Spring HATEOAS self-link construction using the secure public UUID string
    OrganisationModel model = createModelWithId(partyPublicId, entity);

    // Map fields securely
    model.setPartyPublicId(partyPublicId);
    model.setParty(partyAssembler.toModel(party));

    // Map standard properties
    model.setPartyPublicId(partyPublicId);
    model.setName(entity.getName());
    model.setEmail(entity.getEmail());
    model.setPhoneNumber(entity.getPhoneNumber());
    model.setFaxNumber(entity.getFaxNumber());
    model.setPreferredContactMethod(entity.getPreferredContactMethod());
    model.setEstablishmentDate(entity.getEstablishmentDate());

    return model;
  }
}