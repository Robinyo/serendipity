package org.serendipity.party.assembler;

import org.serendipity.party.controller.IndividualNameController;
import org.serendipity.party.entity.IndividualName;
import org.serendipity.party.model.IndividualNameModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class IndividualNameAssembler
  extends RepresentationModelAssemblerSupport<IndividualName, IndividualNameModel> {

  public IndividualNameAssembler() {
    super(IndividualNameController.class, IndividualNameModel.class);
  }

  @Override
  public @Nullable IndividualNameModel toModel(IndividualName entity) {

    if (entity == null) {
      return null;
    }

    // 1. Extract parent individual
    var individual = entity.getIndividual();

    // 2. Structural safety checks for parent contexts
    if (individual == null || individual.getParty() == null || individual.getParty().getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble IndividualNameModel: Parent Individual or Party publicId is missing.");
    }

    String partyPublicId = individual.getParty().getPublicId();

    // 3. Generate HATEOAS Model mapping and self-link
    IndividualNameModel model = createModelWithId(partyPublicId, entity);

    // 4. Map public UUID to the 'id' field on the model
    model.setId(partyPublicId);

    // 5. Map top-level entity properties
    model.setType(entity.getType());
    model.setFromDate(entity.getFromDate());
    model.setToDate(entity.getToDate());

    // 6. Navigate into the @Embedded name object with null guards
    var embeddedName = entity.getName();
    if (embeddedName != null) {;
      model.setGivenName(embeddedName.getGivenName());
      model.setPreferredName(embeddedName.getPreferredName());
      model.setMiddleName(embeddedName.getMiddleName());
      model.setFamilyName(embeddedName.getFamilyName());
      model.setInitials(embeddedName.getInitials());
      model.setHonorific(embeddedName.getHonorific());
      model.setSalutation(embeddedName.getSalutation());
    }

    return model;
  }

}
