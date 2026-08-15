package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.OrganisationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationService {

  private final OrganisationRepository repository;

  @Transactional(readOnly = true)
  public Page<Organisation> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Organisation findByPartyPublicId(final String publicId) {
    return repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Organisation not found with id: " + publicId));
  }

  @Transactional(readOnly = true)
  public Page<Organisation> findByName(final String name, Pageable pageable) {
    return repository.findByName(name, pageable);
  }

  @Transactional(readOnly = true)
  public Page<Organisation> findByNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameStartsWith(name, pageable);
  }

  @Transactional(readOnly = true)
  public boolean existsByPartyPublicId(final String publicId) {
    return repository.existsByPartyPublicId(publicId);
  }

  @Transactional
  public Organisation save(Organisation organisation) {

    log.debug("Saving Organisation: {}", organisation);

    return repository.save(organisation);
  }

  @Transactional
  public Organisation update(final String publicId, Organisation updatedOrganisation) {

    log.debug("Updating Organisation with publicId: {}", publicId);

    Organisation existing = repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Organisation not found with id: " + publicId));

    // 1. Basic Information
    existing.setName(updatedOrganisation.getName());

    // 2. Contact Information
    existing.setEmail(updatedOrganisation.getEmail());
    existing.setPhoneNumber(updatedOrganisation.getPhoneNumber());
    existing.setFaxNumber(updatedOrganisation.getFaxNumber());
    existing.setPreferredContactMethod(updatedOrganisation.getPreferredContactMethod());

    // 3. Dates & Details
    existing.setEstablishmentDate(updatedOrganisation.getEstablishmentDate());

    // 4. Update Parent Party (if present)
    if (updatedOrganisation.getParty() != null && existing.getParty() != null) {
      existing.getParty().setDisplayName(updatedOrganisation.getParty().getDisplayName());
    }

    return repository.save(existing);
  }

  @Transactional
  public void deleteByPartyPublicId(final String publicId) {

    log.debug("Deleting Organisation with publicId: {}", publicId);

    if (!repository.existsByPartyPublicId(publicId)) {
      throw new ResourceNotFoundException("Organisation not found with id: " + publicId);
    }

    repository.deleteByPartyPublicId(publicId);
  }

}