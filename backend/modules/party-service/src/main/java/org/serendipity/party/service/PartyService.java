package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.Party;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.PartyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PartyService {

  private final PartyRepository partyRepository;

  @Transactional(readOnly = true)
  public Party findEntityByPublicId(String publicId) {
    return partyRepository.findByPublicId(publicId)
        .orElseThrow(() -> new ResourceNotFoundException("Party not found for id: " + publicId));
  }
}
