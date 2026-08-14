package org.serendipity.party.assembler;

import org.serendipity.party.controller.IndividualController;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.model.IndividualSummaryModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class IndividualSummaryAssembler
  extends RepresentationModelAssemblerSupport<Individual, IndividualSummaryModel> {

  private static final String ROLE_CONTACT = "Contact";
  private static final String ROLE_ACCOUNT = "Account";

  public IndividualSummaryAssembler() {
    super(IndividualController.class, IndividualSummaryModel.class);
  }

  @Override
  public @Nullable IndividualSummaryModel toModel(Individual entity) {

    if (entity == null) {
      return null;
    }

    var party = entity.getParty();
    if (party == null || party.getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble IndividualSummaryModel: Parent Party or publicId is missing.");
    }

    String partyPublicId = party.getPublicId();

    // Create self link pointing to: GET /individuals/{partyPublicId}
    IndividualSummaryModel model = createModelWithId(partyPublicId, entity);

    // Map basic properties
    model.setId(partyPublicId);
    model.setPartyDisplayName(party.getDisplayName());
    model.setEmail(entity.getEmail());

    // Extract the Account role matching the Angular frontend logic
    if (party.getRoles() != null) {
      party.getRoles().stream()
        .filter(role -> ROLE_CONTACT.equalsIgnoreCase(role.getRole())
          && ROLE_ACCOUNT.equalsIgnoreCase(role.getReciprocalRole()))
        .findFirst()
        .ifPresent(accountRole -> {
          model.setOrganisationId(accountRole.getReciprocalPartyPublicId());
          model.setOrganisationDisplayName(accountRole.getReciprocalPartyName());
          model.setOrganisationEmail(accountRole.getReciprocalPartyEmail());
          model.setOrganisationPhoneNumber(accountRole.getReciprocalPartyPhoneNumber());
        });
    }

    return model;
  }
}