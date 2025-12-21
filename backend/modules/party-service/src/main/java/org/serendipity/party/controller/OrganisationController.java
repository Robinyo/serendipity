package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.OrganisationModelAssembler;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.OrganisationModel;
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

  private final OrganisationService service;
  private final OrganisationModelAssembler assembler;
  private final PagedResourcesAssembler<Organisation> pagedResourcesAssembler;

  public OrganisationController(OrganisationService service,
                                OrganisationModelAssembler assembler,
                                PagedResourcesAssembler<Organisation> pagedResourcesAssembler) {

    this.service = service;
    this.assembler = assembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;

  }

  @GetMapping("/organisations")
  public ResponseEntity<PagedModel<OrganisationModel>> findAll(Pageable pageable) {

    log.info("OrganisationController GET /organisations");

    Page<Organisation> entities = service.findAll(pageable);
    PagedModel<OrganisationModel> models = pagedResourcesAssembler.toModel(entities, assembler);

    // logInfo(entities, models);

    return ResponseEntity.ok(models);

  }

  @GetMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> findById(@PathVariable("id") final Long id) {

    log.info("OrganisationController GET /organisations/{id}");

    Organisation entity = service.findById(id);
    OrganisationModel model = assembler.toModel(entity);

    // logInfo(entity, model);

    return ResponseEntity.ok(model);

  }

  @GetMapping("/organisations/search/findByNameStartsWith")
  public ResponseEntity<PagedModel<OrganisationModel>> findByNameStartsWith(@RequestParam("name") final String name,
                                                                            Pageable pageable) {

    log.info("OrganisationController GET /organisations/search/findByNameStartsWith");

    Page<Organisation> entities = service.findByNameStartsWith(name, pageable);
    PagedModel<OrganisationModel> models = pagedResourcesAssembler.toModel(entities, assembler);

    // logInfo(entities, models);

    return ResponseEntity.ok(models);

  }

  @PostMapping("/organisations")
  public ResponseEntity<OrganisationModel> create(@RequestBody Organisation organisation) {

    log.info("OrganisationController POST /organisations");

    Organisation entity = service.save(organisation);
    OrganisationModel model = assembler.toModel(entity);

    // logInfo(entity, model);

    return ResponseEntity
        .created(model.getRequiredLink(IanaLinkRelations.SELF).toUri())
        .body(model);
  }

  @PatchMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> update(@PathVariable("id") final Long id,
                                                  @RequestBody Organisation organisation) {

    log.info("OrganisationController PATCH /organisations/{id}");

    // logInfo(organisation, null);

    organisation.setId(id);

    Organisation entity = service.save(organisation);
    OrganisationModel model = assembler.toModel(entity);

    // logInfo(entity, model);

    return ResponseEntity.ok(model);

  }

  @DeleteMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> delete(@PathVariable("id") final Long id) {

    log.info("OrganisationController DELETE /organisations/{id}");

    service.deleteById(id);

    return ResponseEntity.noContent().build();

  }

}
