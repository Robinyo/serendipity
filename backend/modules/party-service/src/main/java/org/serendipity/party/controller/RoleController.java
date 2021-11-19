package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.RoleModelAssembler;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.serendipity.party.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

@BasePathAwareController
@Slf4j
public class RoleController extends Controller<Role, RoleRepository, RoleModelAssembler> {

  // Suppress IntelliJ IDEA Error: Could not autowire. No beans of 'PagedResourcesAssembler<Individual>' type found.
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  RoleController(RoleRepository repository,
                 RoleModelAssembler assembler,
                 PagedResourcesAssembler<Role> pagedResourcesAssembler) {

    super(repository, assembler, pagedResourcesAssembler);
  }

  @GetMapping("/roles/search/findByPartyId")
  public ResponseEntity<PagedModel<RoleModel>> findByPartyId(
    @RequestParam("partyId") final Long partyId, Pageable pageable) throws ResponseStatusException {

    log.info("IndividualController GET /roles/search/findByPartyId");

    try {

      Page<Role> entities = repository.findByPartyId(partyId, pageable);
      PagedModel<RoleModel> models = pagedResourcesAssembler.toModel(entities, assembler);

      // logInfo(entities, models);

      return ResponseEntity.ok(models);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/roles/{id}")
  public ResponseEntity<RoleModel> findById(@PathVariable("id") final Long id) throws ResponseStatusException {

    log.info("RoleController GET /roles/{id}");

    try {

      Role entity = repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));

      RoleModel model = assembler.toModel(entity);

      logInfo(entity, model);

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

}
