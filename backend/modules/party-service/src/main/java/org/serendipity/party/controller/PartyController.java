package org.serendipity.party.controller;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.assembler.RoleAssembler;
import org.serendipity.party.entity.Role;
import org.serendipity.party.model.RoleModel;
import org.serendipity.party.service.RoleService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
public class PartyController {

  private final RoleService roleService;
  private final RoleAssembler roleAssembler;

  @GetMapping("/{partyPublicId}/roles")
  public ResponseEntity<CollectionModel<RoleModel>> getPartyRoles(@PathVariable String partyPublicId) {

    // 1. Fetch roles via the injected service instance
    List<Role> roles = roleService.findAllByPartyPublicId(partyPublicId);

    // 2. Spring Data JPA guarantees a non-null List for collection queries,
    //    so roleAssembler can directly convert it
    CollectionModel<RoleModel> collectionModel = roleAssembler.toCollectionModel(roles);

    // 3. Attach self-link matching partyPublicId parameter
    collectionModel.add(
      linkTo(methodOn(PartyController.class).getPartyRoles(partyPublicId))
        .withSelfRel()
    );

    return ResponseEntity.ok(collectionModel);
  }
}