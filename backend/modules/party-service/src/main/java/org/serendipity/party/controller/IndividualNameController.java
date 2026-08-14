package org.serendipity.party.controller;

import org.serendipity.party.model.IndividualNameModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/individual-names")
public class IndividualNameController {

  @GetMapping("/{partyPublicId}")
  public ResponseEntity<CollectionModel<IndividualNameModel>> getNamesByParty(@PathVariable String partyPublicId) {
    // Business logic handler endpoint
    return ResponseEntity.ok(CollectionModel.empty());
  }
}
