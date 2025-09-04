package org.serendipity.party.assembler;

import org.serendipity.party.controller.ElectoralDivisionController;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.model.ElectoralDivisionModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class ElectoralDivisionAssembler extends RepresentationModelAssemblerSupport<ElectoralDivision, ElectoralDivisionModel> {

  public ElectoralDivisionAssembler() {
    super(ElectoralDivisionController.class, ElectoralDivisionModel.class);
  }

  @Override
  public ElectoralDivisionModel toModel(ElectoralDivision entity) {

    ElectoralDivisionModel model = instantiateModel(entity);

    model.setId(entity.getId());
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
