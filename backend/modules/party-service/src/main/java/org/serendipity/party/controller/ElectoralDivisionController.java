package org.serendipity.party.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.assembler.ElectoralDivisionModelAssembler;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.model.ElectoralDivisionModel;
import org.serendipity.party.service.ElectoralDivisionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@BasePathAwareController
@Slf4j
public class ElectoralDivisionController {

  private final ElectoralDivisionService service;
  private final ElectoralDivisionModelAssembler assembler;
  private final PagedResourcesAssembler<ElectoralDivision> pagedResourcesAssembler;

  public ElectoralDivisionController(ElectoralDivisionService service,
                                     ElectoralDivisionModelAssembler assembler,
                                     PagedResourcesAssembler<ElectoralDivision> pagedResourcesAssembler) {

    this.service = service;
    this.assembler = assembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;

  }

  @GetMapping("/electoral-divisions")
  public ResponseEntity<PagedModel<ElectoralDivisionModel>> findAll(Pageable pageable) {

    log.info("ElectoralDivisionController GET /electoral-divisions");

    Page<ElectoralDivision> entities = service.findAll(pageable);
    PagedModel<ElectoralDivisionModel> models = pagedResourcesAssembler.toModel(entities, assembler);

    // logInfo(entities, models);

    return ResponseEntity.ok(models);

  }

  @GetMapping("/electoral-divisions/search/findByName")
  public ResponseEntity<ElectoralDivisionModel> findByName(@RequestParam("name") final String name) {

    log.info("IndividualController GET /electoral-divisions/search/findByName");

    ElectoralDivision entity = service.findByName(name);
    ElectoralDivisionModel model = assembler.toModel(entity);

    // logInfo(entity, model);

    return ResponseEntity.ok(model);

  }

}
