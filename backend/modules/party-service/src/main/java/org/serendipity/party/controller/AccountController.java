package org.serendipity.party.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.OrganisationAssembler;
import org.serendipity.party.dto.OrganisationUpdateDto;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.mapper.OrganisationMapper;
import org.serendipity.party.model.OrganisationModel;
import org.serendipity.party.service.OrganisationService;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@BasePathAwareController
@Slf4j
public class AccountController {

  private final OrganisationService organisationService;
  private final OrganisationAssembler organisationAssembler;
  private final OrganisationMapper organisationMapper;

  public AccountController(OrganisationService organisationService,
                           OrganisationAssembler organisationAssembler,
                           OrganisationMapper organisationMapper) {

    this.organisationService = organisationService;
    this.organisationAssembler = organisationAssembler;
    this.organisationMapper = organisationMapper;
  }

  // --- UPDATE BY PUBLIC ID ---
  @PutMapping("/accounts/{publicId}")
  public ResponseEntity<OrganisationModel> update(
    @PathVariable final String publicId,
    @Valid @RequestBody OrganisationUpdateDto updateDto) {

    log.info("Account Controller PUT /organisations/{} using Update DTO", publicId);

    // Fetch the existing entity out of the DB matching the public UUID path
    Organisation existingOrganisation = organisationService.findByPartyPublicId(publicId);

    // Merge only the allowed DTO fields into the managed entity reference
    organisationMapper.updateEntityFromDto(updateDto, existingOrganisation);

    Organisation updatedEntity = organisationService.save(existingOrganisation);
    return ResponseEntity.ok(organisationAssembler.toModel(updatedEntity));
  }


}

/*

  // --- UPDATE BY PUBLIC ID ---
  @PutMapping("/organisations/{publicId}")
  public ResponseEntity<OrganisationModel> update(
    @PathVariable final String publicId,
    @RequestBody Organisation organisation) {

    log.info("Organisation Controller PUT /organisations/{}", publicId);

    Organisation updatedEntity = organisationService.update(publicId, organisation);
    OrganisationModel model = organisationAssembler.toModel(updatedEntity);

    return ResponseEntity.ok(model);
  }

*/

