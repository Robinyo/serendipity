package org.serendipity.party.assembler;

import org.serendipity.party.controller.IndividualController;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.model.IndividualModel;
import org.serendipity.party.model.NameModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class IndividualAssembler extends RepresentationModelAssemblerSupport<Individual, IndividualModel> {

  private final PartyAssembler partyAssembler;
  private final IndividualNameAssembler individualNameAssembler;

  public IndividualAssembler(PartyAssembler partyAssembler, IndividualNameAssembler individualNameAssembler) {
    // Tell HATEOAS which Controller manages this resource workflow
    super(IndividualController.class, IndividualModel.class);
    this.partyAssembler = partyAssembler;
    this.individualNameAssembler = individualNameAssembler;
  }

  @Override
  public @Nullable IndividualModel toModel(Individual entity) {

    if (entity == null) {
      return null;
    }

    var party = entity.getParty();
    if (party == null || party.getPublicId() == null) {
      throw new IllegalStateException("Cannot assemble IndividualModel: Parent Party or publicId is missing.");
    }

    String partyPublicId = party.getPublicId();

    // Standard Spring HATEOAS self-link construction using the secure public UUID string
    IndividualModel model = createModelWithId(partyPublicId, entity);

    // Map public UUID to the 'id' field on the model
    model.setId(partyPublicId);
    model.setParty(partyAssembler.toModel(party));

    // Embedded Name mapping pattern
    var embeddedName = entity.getName();
    if (embeddedName != null) {
      model.setName(NameModel.builder()
        .title(embeddedName.getTitle())
        .givenName(embeddedName.getGivenName())
        .preferredName(embeddedName.getPreferredName())
        .middleName(embeddedName.getMiddleName())
        .familyName(embeddedName.getFamilyName())
        .initials(embeddedName.getInitials())
        .honorific(embeddedName.getHonorific())
        .salutation(embeddedName.getSalutation())
        .build());
    }

    if (entity.getNames() != null) {
      model.setNames(entity.getNames().stream()
        .map(individualNameAssembler::toModel)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet()));
    } else {
      model.setNames(Collections.emptySet());
    }

    // Map standard properties
    model.setJobTitle(entity.getJobTitle());
    model.setSex(entity.getSex());
    model.setGender(entity.getGender());
    model.setEmail(entity.getEmail());
    model.setPhoneNumber(entity.getPhoneNumber());
    model.setFaxNumber(entity.getFaxNumber());
    model.setPreferredContactMethod(entity.getPreferredContactMethod());
    model.setPhotoUrl(entity.getPhotoUrl());
    model.setElectorate(entity.getElectorate());

    if (entity.getDateOfBirth() != null) {
      model.setDateOfBirth(entity.getDateOfBirth().toString());
    }


    model.setPlaceOfBirth(entity.getPlaceOfBirth());
    model.setCountryOfBirth(entity.getCountryOfBirth());

    if (entity.getDateOfDeath() != null) {
      model.setDateOfDeath(entity.getDateOfDeath().toString());
    }

    model.setPlaceOfDeath(entity.getPlaceOfDeath());
    model.setCountryOfDeath(entity.getCountryOfDeath());

    return model;
  }

}