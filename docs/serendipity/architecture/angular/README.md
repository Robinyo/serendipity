<h1 align="center">Angular</h1>

## Best Practices

### HttpParams

In Angular, `HttpParams` is an immutable class used to construct and manage serialised query parameters for HTTP 
requests. It handles URL encoding automatically and integrates natively with the `HttpClient` service.

Core Concept: Immutability
HttpParams is strictly **immutable**. Methods like `.set()` and `.append()` do not change the existing object; instead, 
they **return a brand-new instance**. You must chain your methods or reassign the variable.

#### Basic Usage (Method Chaining)

The cleanest way to construct parameters for a single request is via method chaining.

```
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

const http = inject(HttpClient);

// Method chaining creates and configures the params inline
const params = new HttpParams()
  .set('page', '2')
  .set('sort', 'desc');

http.get('https://example.com', params).subscribe();
// Final URL: https://example.com?page=2&sort=desc
```

#### Dynamic Initialisation (From an Object)

If you have a local object containing your filters, you can pass it directly to the `HttpParams` constructor using 
`fromObject`.

```
const searchFilters = {
  query: 'angular',
  limit: '10',
  active: 'true'
};

const params = new HttpParams({ fromObject: searchFilters });

http.get('https://example.com',params).subscribe();
```

#### Conditional Parameters (Variable Reassignment)

When you need to build query strings conditionally based on application state, you must reassign the parameter instance.

```
let params = new HttpParams();

if (userId) {
  params = params.set('userId', userId); // Reassignment is required
}
if (isAdmin) {
  params = params.set('role', 'admin');
}
```

#### set() vs append()

- set(): Replaces any existing value for the given key with the new value.
- append(): Adds a new value to the key without clearing prior values, resulting in multiple values for the same key in 
  the URL string.

```
// Using set()
let params1 = new HttpParams().set('id', '1').set('id', '2');
// Result: ?id=2

// Using append() (Useful for arrays/multi-select filters)
let params2 = new HttpParams().append('tags', 'frontend').append('tags', 'ts');
// Result: ?tags=frontend&tags=ts
```
