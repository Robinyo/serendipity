package org.serendipity.party.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Slf4j
public abstract class BaseService<T, S> {

  // protected final T entity;
  protected final S repository;

  public BaseService(S repository) {
    // this.entity = entity;
    this.repository = repository;
  }

}

/*

  public Page<T> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Page<Entity> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

*/
