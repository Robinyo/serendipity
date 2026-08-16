package org.serendipity.party.assembler;

import org.serendipity.party.controller.IndividualController;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.OrganisationSummaryModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class OrganisationSummaryAssembler
  extends RepresentationModelAssemblerSupport<Organisation, OrganisationSummaryModel> {

  private static final String PRIMARY_CONTACT = "Primary Contact";

  public OrganisationSummaryAssembler() {
    super(IndividualController.class, OrganisationSummaryModel.class);
  }

  @Override
  public @Nullable OrganisationSummaryModel toModel(Organisation entity) {

    if (entity == null) {
      return null;
    }

    var party = entity.getParty();
    if (party == null || party.getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble OrganisationSummaryAssembler: Parent Party or publicId is missing.");
    }

    String partyPublicId = party.getPublicId();

    // Generates HATEOAS model with self-link: GET /individuals/{partyPublicId}
    OrganisationSummaryModel model = createModelWithId(partyPublicId, entity);

    // Map basic properties
    model.setId(partyPublicId);
    model.setPartyDisplayName(party.getDisplayName());
    model.setEmail(entity.getEmail());
    model.setPhoneNumber(entity.getPhoneNumber());

    // Extract the Account role with null checks on role properties
    if (party.getRoles() != null) {
      party.getRoles().stream()
        .filter(role -> role != null
          && PRIMARY_CONTACT.equalsIgnoreCase(role.getReciprocalRole()))
        .findFirst()
        .ifPresent(accountRole -> {
          model.setIndividualId(accountRole.getReciprocalPartyPublicId());
          model.setIndividualDisplayName(accountRole.getReciprocalPartyName());
          model.setIndividualEmail(accountRole.getReciprocalPartyEmail());
          model.setIndividualPhoneNumber(accountRole.getReciprocalPartyPhoneNumber());
        });
    }

    return model;
  }

}