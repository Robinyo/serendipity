package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.IndividualModelAssembler;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.entity.Party;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.IndividualModel;
import org.serendipity.party.repository.IndividualRepository;
import org.serendipity.party.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@BasePathAwareController
@Slf4j
public class IndividualController extends Controller<Individual, IndividualRepository, IndividualModelAssembler> {

  protected final RoleRepository roleRepository;

  // Suppress IntelliJ IDEA Error: Could not autowire. No beans of 'PagedResourcesAssembler<Individual>' type found.
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  public IndividualController(IndividualRepository repository,
                              IndividualModelAssembler assembler,
                              PagedResourcesAssembler<Individual> pagedResourcesAssembler,
                              RoleRepository roleRepository) {

    super(repository, assembler, pagedResourcesAssembler);

    this.roleRepository = roleRepository;
  }

  @GetMapping("/individuals")
  public ResponseEntity<PagedModel<IndividualModel>> findAll(Pageable pageable) throws ResponseStatusException {

    log.info("IndividualController GET /individuals");

    try {

      Page<Individual> entities = repository.findAll(pageable);
      PagedModel<IndividualModel> models = pagedResourcesAssembler.toModel(entities, assembler);

      // logInfo(entities, models);

      return ResponseEntity.ok(models);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/individuals/{id}")
  public ResponseEntity<IndividualModel> findById(@PathVariable("id") final Long id) throws ResponseStatusException {

    log.info("IndividualController GET /individuals/{id}");

    try {

      Individual entity = repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));

      IndividualModel model = assembler.toModel(entity);

      logInfo(entity, model);

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/individuals/search/findByFamilyNameStartsWith")
  public ResponseEntity<PagedModel<IndividualModel>> findByFamilyNameStartsWith(
    @RequestParam("name") final String name, Pageable pageable) throws ResponseStatusException {

    log.info("IndividualController GET /individuals/search/findByFamilyNameStartsWith");

    try {

      Page<Individual> entities = repository.findByNameFamilyNameStartsWith(name, pageable);
      PagedModel<IndividualModel> models = pagedResourcesAssembler.toModel(entities, assembler);

      // logInfo(entities, models);

      return ResponseEntity.ok(models);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @PostMapping("/individuals")
  public ResponseEntity<IndividualModel> create(@RequestBody Individual individual) throws ResponseStatusException {

    log.info("IndividualController POST /individuals");

    try {

      Individual entity = repository.save(individual);
      IndividualModel model = assembler.toModel(entity);

      logInfo(entity, model);

      return ResponseEntity.created(linkTo(methodOn(IndividualController.class).findById(entity.getId())).toUri()).body(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @PatchMapping("/individuals/{id}")
  public ResponseEntity<IndividualModel> update(
    @PathVariable("id") final Long id, @RequestBody Individual individual) throws ResponseStatusException {

    log.info("IndividualController PATCH /individuals/{id}");

    logInfo(individual, null);

    try {

      individual.setId(id);

      repository.save(individual);

      Link link = linkTo(methodOn(IndividualController.class).findById(id)).withSelfRel();

      return ResponseEntity.noContent().location(new URI(link.getHref())).build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @DeleteMapping("/individuals/{id}")
  public ResponseEntity<IndividualModel> delete(@PathVariable("id") final Long id) throws ResponseStatusException {

    log.info("IndividualController DELETE /individuals/{id}");

    try {

      repository.deleteById(id);

      return ResponseEntity.noContent().build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @DeleteMapping("/individuals/{id}/roles/{roleId}")
  @Transactional
  public ResponseEntity<IndividualModel> deleteRole(
    @PathVariable("id") final Long id,
    @PathVariable("roleId") final Long roleId) throws ResponseStatusException {

    log.info("IndividualController DELETE /individuals/{id}/roles/{roleId}");

    try {

      Individual entity = repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));

      Role role = roleRepository.findById(roleId).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));

      Party party = entity.getParty();

      if (party.getRoles().remove(role)) {

        log.info("IndividualController -> party.getRoles().remove(role)");

        repository.save(entity);

        // logInfo(entity, null);

        roleRepository.delete(role);

      }

      return ResponseEntity.noContent().build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

}

// https://github.com/spring-projects/spring-hateoas-examples/blob/master/simplified/src/main/java/org/springframework/hateoas/examples/EmployeeController.java

// } catch (URISyntaxException e) {
//	   return ResponseEntity.badRequest().body("Unable to create " + employee);
// }

// https://github.com/spring-projects/spring-hateoas-examples/tree/master/basics
// https://github.com/spring-projects/spring-hateoas-examples/tree/master/api-evolution

// https://github.com/spring-projects/spring-hateoas-examples

// https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.web.pageables

/*

  @GetMapping("/")
  public RepresentationModel root() {

    RepresentationModel rootResource = new RepresentationModel();

    rootResource.add(
      linkTo(methodOn(IndividualController.class).root()).withSelfRel());
      // linkTo(methodOn(IndividualController.class).findAll()).withRel("individuals"));

    return rootResource;
  }

ndividual:post
individual:get
individual:patch
individual:delete

*/



/*

    Pageable sort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
          Sort.by("name.familyName").ascending());

    logInfo(pageable, null);
    logInfo(sort, null);

*/
