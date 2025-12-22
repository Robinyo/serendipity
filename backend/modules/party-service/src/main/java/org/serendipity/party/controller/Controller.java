package org.serendipity.party.controller;

// import com.fasterxml.jackson.annotation.JsonInclude;
// import tools.jackson.databind.SerializationFeature;
// import tools.jackson.databind.json.JsonMapper;
// import tools.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Controller {

  /*

  protected void logInfo(Object entity, Object model) {

    ObjectMapper mapper = JsonMapper.builder()
        .defaultPropertyInclusion(JsonInclude.Value.construct(JsonInclude.Include.NON_NULL, JsonInclude.Include.NON_EMPTY))
        .build();

    // mapper.enable(SerializationFeature.INDENT_OUTPUT);

    if (entity != null) {
      log.info("entity: {}", "\n" + mapper.writeValueAsString(entity));
    }

    if (model != null) {
      log.info("model: {}", "\n" + mapper.writeValueAsString(model));
    }

  }

  */

}

/*

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

*/
