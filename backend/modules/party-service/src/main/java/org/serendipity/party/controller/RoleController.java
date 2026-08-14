package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.RoleAssembler;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.serendipity.party.service.RoleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@BasePathAwareController
@Slf4j
public class RoleController {

  private final RoleService service;
  private final RoleAssembler assembler;
  private final PagedResourcesAssembler<Role> pagedResourcesAssembler;

  RoleController(RoleService service,
                 RoleAssembler assembler,
                 PagedResourcesAssembler<Role> pagedResourcesAssembler) {

    this.service = service;
    this.assembler = assembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;

  }


}

/*

  @GetMapping("/roles/search/findByPartyId")
  public ResponseEntity<PagedModel<RoleModel>> findByPartyId(@RequestParam("partyId") final String partyId,
                                                             Pageable pageable) {

    log.info("RoleController GET /roles/search/findByPartyId");

    Page<Role> entities = service.findByPublicId(partyId, pageable);
    PagedModel<RoleModel> models = pagedResourcesAssembler.toModel(entities, assembler);

    // logInfo(entities, models);

    return ResponseEntity.ok(models);

  }

  @GetMapping("/roles/{id}")
  public ResponseEntity<RoleModel> findById(@PathVariable("id") final String id) {

    log.info("RoleController GET /roles/{id}");

    Role entity = service.findByPublicId(id);
    RoleModel model = assembler.toModel(entity);

    // logInfo(entity, model);

    return ResponseEntity.ok(model);

  }

*/

