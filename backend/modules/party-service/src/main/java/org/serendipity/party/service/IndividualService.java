package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.IndividualRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class IndividualService {

  private final IndividualRepository repository;

  @Transactional(readOnly = true)
  public Page<Individual> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Individual findByPartyPublicId(String publicId) {
    return repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Individual not found with id: " + publicId));
  }

  @Transactional(readOnly = true)
  public Page<Individual> findByNameFamilyNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameFamilyNameStartsWith(name, pageable);
  }

  @Transactional
  public Individual save(Individual individual) {
    log.debug("Saving Individual: {}", individual);
    return repository.save(individual);
  }

  @Transactional
  public Individual update(String publicId, Individual updatedIndividual) {
    log.debug("Updating Individual with publicId: {}", publicId);

    Individual existing = repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Individual not found with id: " + publicId));

    // 1. Basic & Name Information
    existing.setName(updatedIndividual.getName());
    existing.setJobTitle(updatedIndividual.getJobTitle());
    existing.setSex(updatedIndividual.getSex());
    existing.setGender(updatedIndividual.getGender());

    // 2. Contact Information
    existing.setEmail(updatedIndividual.getEmail());
    existing.setPhoneNumber(updatedIndividual.getPhoneNumber());
    existing.setFaxNumber(updatedIndividual.getFaxNumber());
    existing.setPreferredContactMethod(updatedIndividual.getPreferredContactMethod());

    // 3. Profile & Location
    existing.setPhotoUrl(updatedIndividual.getPhotoUrl());
    existing.setElectorate(updatedIndividual.getElectorate());

    // 4. Birth Details
    existing.setDateOfBirth(updatedIndividual.getDateOfBirth());
    existing.setPlaceOfBirth(updatedIndividual.getPlaceOfBirth());
    existing.setCountryOfBirth(updatedIndividual.getCountryOfBirth());

    // 5. Death Details
    existing.setDateOfDeath(updatedIndividual.getDateOfDeath());
    existing.setPlaceOfDeath(updatedIndividual.getPlaceOfDeath());
    existing.setCountryOfDeath(updatedIndividual.getCountryOfDeath());

    // 6. Relationship Status
    // existing.setRelationshipLifecycleStatus(updatedIndividual.getRelationshipLifecycleStatus());

    // 7. Update Party (if present)
    if (updatedIndividual.getParty() != null && existing.getParty() != null) {
      existing.getParty().setDisplayName(updatedIndividual.getParty().getDisplayName());
    }

    // 8. Child Collection (names): Clear and add to handle orphanRemoval properly
    if (updatedIndividual.getNames() != null) {
      existing.getNames().clear();
      updatedIndividual.getNames().forEach(existing::addIndividualName);
    }

    return repository.save(existing);
  }

  @Transactional
  public void deleteByPartyPublicId(final String id) {
    log.debug("Deleting Individual with publicId: {}", id);

    if (!repository.existsByPartyPublicId(id)) {
      throw new ResourceNotFoundException("Individual not found with id: " + id);
    }

    repository.deleteByPartyPublicId(id);
  }

}

// How Spring Data JPA resolves this:
// findBy -> Query prefix.
// Party -> Refers to `private Party party;` inside the `Individual` entity.
// PublicId -> Refers to `private String publicId;` inside the `Party` entity.
// Tip: If there's ever any ambiguity in complex entity relationships, you can use an underscore to explicitly
// clarify property traversal: findByParty_PublicId(String publicId).

// Return Optional<T>: For any query or method where finding 0 or 1 entity is expected (e.g., lookup by ID or unique key).
// Return List<T> / Page<T>: For collections. Never return null or Optional<List<T>> for collections; return an empty list/page instead.

// How Spring Handles ResponseStatusException
// Spring's default mechanisms (specifically the ResponseStatusExceptionResolver) are designed to automatically
// process ResponseStatusException instances and translate them into appropriate HTTP responses with the correct
// status code and message.
// If you throw a ResponseStatusException in your controller or service layer, Spring will automatically use its
// properties to return a proper error response.

// public Individual findByPartyPublicId(final String id) throws ResponseStatusException {
//   return repository.findByPartyPublicId(id).orElseThrow(() ->
//       new ResponseStatusException(HttpStatus.NOT_FOUND));
// }
