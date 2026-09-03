package org.serendipity.party.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.IndividualAssembler;
import org.serendipity.party.dto.IndividualUpdateDto;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.mapper.IndividualMapper;
import org.serendipity.party.model.IndividualModel;
import org.serendipity.party.service.IndividualService;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@BasePathAwareController
@Slf4j
public class ContactController {

  private final IndividualService individualService;
  private final IndividualAssembler individualAssembler;
  private final IndividualMapper individualMapper;

  public ContactController(IndividualService individualService,
                           IndividualAssembler individualAssembler,
                           IndividualMapper individualMapper) {

    this.individualService = individualService;
    this.individualAssembler = individualAssembler;
    this.individualMapper = individualMapper;
  }

  // --- UPDATE BY PUBLIC ID ---
  @PutMapping("/contacts/{publicId}")
  public ResponseEntity<IndividualModel> update(
    @PathVariable final String publicId,
    @Valid @RequestBody IndividualUpdateDto updateDto) {

    log.info("Contact Controller PUT /individuals/{} using Update DTO", publicId);

    // Fetch the existing entity out of the DB matching the public UUID path
    Individual existingIndividual = individualService.findByPartyPublicId(publicId);

    // Merge only the allowed DTO fields into the managed entity reference
    individualMapper.updateEntityFromDto(updateDto, existingIndividual);

    Individual updatedEntity = individualService.save(existingIndividual);
    return ResponseEntity.ok(individualAssembler.toModel(updatedEntity));
  }

}

/*

  // --- UPDATE BY PUBLIC ID ---
  @PutMapping("/individuals/{publicId}")
  public ResponseEntity<IndividualModel> update(
    @PathVariable final String publicId,
    @RequestBody Individual individual) {

    log.info("Individual Controller PUT /individuals/{}", publicId);

    Individual updatedEntity = individualService.update(publicId, individual);
    IndividualModel model = individualAssembler.toModel(updatedEntity);

    return ResponseEntity.ok(model);
  }

*/
