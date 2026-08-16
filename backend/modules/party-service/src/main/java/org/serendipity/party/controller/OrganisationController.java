package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.OrganisationAssembler;
import org.serendipity.party.assembler.OrganisationSummaryAssembler;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.IndividualModel;
import org.serendipity.party.model.OrganisationModel;
import org.serendipity.party.model.OrganisationSummaryModel;
import org.serendipity.party.service.OrganisationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@BasePathAwareController
@Slf4j
public class OrganisationController {

  private final OrganisationService organisationService;
  private final OrganisationAssembler organisationAssembler;
  private final OrganisationSummaryAssembler organisationSummaryAssembler;
  private final PagedResourcesAssembler<Organisation> organisationPagedResourcesAssembler;

  public OrganisationController(OrganisationService organisationService,
                                OrganisationAssembler organisationAssembler,
                                OrganisationSummaryAssembler organisationSummaryAssembler,
                                PagedResourcesAssembler<Organisation> organisationPagedResourcesAssembler) {

    this.organisationService = organisationService;
    this.organisationAssembler = organisationAssembler;
    this.organisationSummaryAssembler = organisationSummaryAssembler;
    this.organisationPagedResourcesAssembler = organisationPagedResourcesAssembler;

  }

  // --- READ ALL ---
  @GetMapping("/organisations")
  public ResponseEntity<PagedModel<OrganisationSummaryModel>> findAll(Pageable pageable) {

    log.info("Organisation Controller GET /organisations - page: {}", pageable);

    Page<Organisation> entities = organisationService.findAll(pageable);
    PagedModel<OrganisationSummaryModel> models = organisationPagedResourcesAssembler.toModel(entities, organisationSummaryAssembler);

    return ResponseEntity.ok(models);

  }

  // --- SEARCH BY NAME ---
  @GetMapping("/organisations/search/findByNameStartsWith")
  public ResponseEntity<PagedModel<OrganisationSummaryModel>> findByNameStartsWith(@RequestParam("name") final String name,
                                                                            Pageable pageable) {

    log.info("Organisation Controller GET /individuals/search/findByFamilyNameStartsWith - name: {}", name);

    Page<Organisation> entities = organisationService.findByNameStartsWith(name, pageable);
    PagedModel<OrganisationSummaryModel> models = organisationPagedResourcesAssembler.toModel(entities, organisationSummaryAssembler);

    return ResponseEntity.ok(models);

  }

  // --- READ ONE BY PUBLIC ID ---
  @GetMapping("/organisations/{publicId}")
  public ResponseEntity<OrganisationModel> findById(@PathVariable("publicId") final String publicId) {

    log.info("Organisation Controller GET /individuals/{}", publicId);

    Organisation entity = organisationService.findByPartyPublicId(publicId);
    OrganisationModel model = organisationAssembler.toModel(entity);

    return ResponseEntity.ok(model);

  }

  // --- CREATE ---
  @PostMapping("/organisations")
  public ResponseEntity<OrganisationModel> create(@RequestBody Organisation organisation) {

    log.info("Organisation Controller POST /organisations");

    Organisation entity = organisationService.save(organisation);
    OrganisationModel model = organisationAssembler.toModel(entity);

    return ResponseEntity
        .created(model.getRequiredLink(IanaLinkRelations.SELF).toUri())
        .body(model);
  }

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

  // --- DELETE BY PUBLIC ID ---
  @DeleteMapping("/organisations/{publicId}")
  public ResponseEntity<Void> delete(@PathVariable final String publicId) {

    log.info("Organisation Controller DELETE /organisations/{}", publicId);

    organisationService.deleteByPartyPublicId(publicId);

    return ResponseEntity.noContent().build();
  }

}
