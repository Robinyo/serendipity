package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.OrganisationModelAssembler;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.model.OrganisationModel;
import org.serendipity.party.repository.OrganisationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@BasePathAwareController
@Slf4j
public class OrganisationController extends Controller<Organisation, OrganisationRepository, OrganisationModelAssembler>{

  public OrganisationController(OrganisationRepository repository,
                                OrganisationModelAssembler assembler,
                                PagedResourcesAssembler<Organisation> pagedResourcesAssembler) {

    super(repository, assembler, pagedResourcesAssembler);
  }

  @GetMapping("/organisations")
  public ResponseEntity<PagedModel<OrganisationModel>> findAll(
    Pageable pageable) throws ResponseStatusException {

    log.info("OrganisationController GET /organisations");

    try {

      Page<Organisation> entities = repository.findAll(pageable);
      PagedModel<OrganisationModel> models = pagedResourcesAssembler.toModel(entities, assembler);

      // logInfo(entities, models);

      return ResponseEntity.ok(models);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> findById(
    @PathVariable("id") final Long id) throws ResponseStatusException {

    log.info("OrganisationController GET /organisations/{id}");

    try {

      Organisation entity = repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));

      OrganisationModel model = assembler.toModel(entity);

      logInfo(entity, model);

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/organisations/search/findByNameStartsWith")
  public ResponseEntity<PagedModel<OrganisationModel>> findByNameStartsWith(
    @RequestParam("name") final String name, Pageable pageable) throws ResponseStatusException {

    log.info("OrganisationController GET /organisations/search/findByNameStartsWith");

    try {

      Page<Organisation> entities = repository.findByNameStartsWith(name, pageable);
      PagedModel<OrganisationModel> models = pagedResourcesAssembler.toModel(entities, assembler);

      // logInfo(entities, models);

      return ResponseEntity.ok(models);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @PostMapping("/organisations")
  public ResponseEntity<OrganisationModel> create(
    @RequestBody Organisation organisation) throws ResponseStatusException {

    log.info("OrganisationController POST /organisations");

    try {

      Organisation entity = repository.save(organisation);
      OrganisationModel model = assembler.toModel(entity);

      logInfo(entity, model);

      return ResponseEntity.created(linkTo(methodOn(OrganisationController.class).findById(entity.getId())).toUri()).body(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @PatchMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> update(
    @PathVariable("id") final Long id, @RequestBody Organisation organisation) throws ResponseStatusException {

    log.info("OrganisationController PATCH /organisations/{id}");

    logInfo(organisation, null);

    try {

      organisation.setId(id);

      repository.save(organisation);

      Link link = linkTo(methodOn(OrganisationController.class).findById(id)).withSelfRel();

      return ResponseEntity.noContent().location(new URI(link.getHref())).build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @DeleteMapping("/organisations/{id}")
  public ResponseEntity<OrganisationModel> delete(
    @PathVariable("id") final Long id) throws ResponseStatusException {

    log.info("OrganisationController DELETE /organisations/{id}");

    try {

      repository.deleteById(id);

      return ResponseEntity.noContent().build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

}
