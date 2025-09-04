package org.serendipity.party.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.web.PagedResourcesAssembler;

@Slf4j
public class Controller<Entity, Repository, Assembler> {

  protected final Repository repository;
  protected final Assembler assembler;
  protected final PagedResourcesAssembler<Entity> pagedResourcesAssembler;

  public Controller(Repository repository, Assembler assembler,
                    PagedResourcesAssembler<Entity> pagedResourcesAssembler) {

    this.repository = repository;
    this.assembler = assembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  protected void logInfo(Object entity, Object model) {

    try {

      ObjectMapper mapper = new ObjectMapper();

      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
      mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

      mapper.enable(SerializationFeature.INDENT_OUTPUT);

      if (entity != null) {
        log.info("entity: {}", "\n" + mapper.writeValueAsString(entity));
      }

      if (model != null) {
        log.info("model: {}", "\n" + mapper.writeValueAsString(model));
      }

    } catch (JsonProcessingException jpe) {

      log.error("Json Processing Exception: {}", jpe.getLocalizedMessage());
    }

  }

}
