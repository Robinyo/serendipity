export interface SpringPageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

// A generic container class thta is designed to wrap a collection of resources with pagination metadata and
// hypermedia links.

export interface PagedResponse<T, EmbeddedKey extends string> {
  _embedded: {
    [key in EmbeddedKey]: T[];
  };
  page: SpringPageMetadata;
  _links?: any;
}
