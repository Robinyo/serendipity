package org.serendipity.party.assembler;

import org.serendipity.party.controller.ElectoralDivisionController;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.model.ElectoralDivisionModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class ElectoralDivisionAssembler
  extends RepresentationModelAssemblerSupport<ElectoralDivision, ElectoralDivisionModel> {

  public ElectoralDivisionAssembler() {
    super(ElectoralDivisionController.class, ElectoralDivisionModel.class);
  }

  @Override
  public @Nullable ElectoralDivisionModel toModel(ElectoralDivision entity) {

    if (entity == null) {
      return null;
    }

    String publicId = entity.getPublicId();

    if (publicId == null) {
      throw new IllegalStateException("Cannot assemble ElectoralDivisionModel: publicId is missing.");
    }

    // Standard Spring HATEOAS self-link construction using publicId
    // Generates link pointing to: GET /api/electoral-divisions/{publicId}
    ElectoralDivisionModel model = createModelWithId(publicId, entity);

    // Map public UUID to the 'id' field on the model
    model.setId(publicId);

    // Map standard fields
    model.setName(entity.getName());
    model.setNameDerivation(entity.getNameDerivation());
    model.setState(entity.getState());
    model.setArea(entity.getArea());
    model.setLocationDescription(entity.getLocationDescription());
    model.setDateGazetted(entity.getDateGazetted());
    model.setLatitude(entity.getLatitude());
    model.setLongitude(entity.getLongitude());

    return model;
  }

}