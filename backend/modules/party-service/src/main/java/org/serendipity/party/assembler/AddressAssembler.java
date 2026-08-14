package org.serendipity.party.assembler;

import org.serendipity.party.controller.AddressController;
import org.serendipity.party.entity.Address;
import org.serendipity.party.model.AddressModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class AddressAssembler extends RepresentationModelAssemblerSupport<Address, AddressModel> {

  public AddressAssembler() {
    super(AddressController.class, AddressModel.class);
  }

  @Override
  public @Nullable AddressModel toModel(Address entity) {

    if (entity == null) {
      return null;
    }

    // Safely extract the parent location
    var location = entity.getLocation();

    // Defensive Check: If the parent or its tracking ID is missing, we cannot build a valid HATEOAS route
    if (location == null || location.getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble AddressModel: Parent Location or publicId is missing.");
    }

    String locationPublicId = location.getPublicId();

    // Guaranteed safe instantiation without violating parent framework null contracts
    AddressModel model = createModelWithId(locationPublicId, entity);

    // Visual Anchor: Explicitly populate the DTO tracking property for the frontend payload
    model.setLocationPublicId(locationPublicId);

    // Map values from Entity to DTO
    model.setName(entity.getName());
    model.setLine1(entity.getLine1());
    model.setLine2(entity.getLine2());
    model.setCity(entity.getCity());
    model.setState(entity.getState());
    model.setPostalCode(entity.getPostalCode());
    model.setCountry(entity.getCountry());
    model.setAddressType(entity.getAddressType());

    return model;
  }

}
