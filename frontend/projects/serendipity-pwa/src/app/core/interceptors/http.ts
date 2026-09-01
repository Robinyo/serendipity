import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpXsrfTokenExtractor } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.headers.has('Content-Type')) {
    return next(req);
  }

  // 1. Extract the token from Angular's utility provider
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  let xsrfToken = tokenExtractor.getToken();

  // ⚡ THE COOKIE REGEX FALLBACK (Crucial for Zoneless timing race conditions)
  if (!xsrfToken && typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
    if (match) {
      xsrfToken = decodeURIComponent(match[2]);
    }
  }

  let activeHeaders = req.headers.set('Accept',
    'application/hal+json, application/json, application/problem+json');

  // 2. Set Content-Type if a request body is present
  if (req.body !== null && req.body !== undefined) {
    activeHeaders = activeHeaders.set('Content-Type', 'application/json');
  }

  // 3. 🔒 BFF SECURITY GATEWAY PROTECTION:
  // If we are performing a data-mutating transaction, ALWAYS force the X-XSRF-TOKEN header!
  // This ensures your BFF will authorize the request, even if the body payload is empty or un-serialized.
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (mutatingMethods.includes(req.method.toUpperCase())) {
    if (xsrfToken) {
      activeHeaders = activeHeaders.set('X-XSRF-TOKEN', xsrfToken);
    }
  }

  const modifiedReq = req.clone({ headers: activeHeaders });
  return next(modifiedReq);
};



/*

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpXsrfTokenExtractor } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  // If a custom override content type is already present, pass it straight through untouched
  if (req.headers.has('Content-Type')) {
    return next(req);
  }

  // Programmatically extract the live XSRF token straight out of browser memory
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const xsrfToken = tokenExtractor.getToken();

  // Establish your base collection media negotiations
  // Add application/problem+json onto your Accept header string.
  // This tells Spring that your PWA can natively ingest RFC 7807 Problem Detail error blocks!
  let activeHeaders = req.headers.set('Accept',
    'application/hal+json, application/json, application/problem+json');

  // Only assign Content-Type if a data body payload actually exists
  if (req.body !== null && req.body !== undefined) {
    activeHeaders = activeHeaders.set('Content-Type', 'application/json');

    // If we are modifying data (PUT/POST) and a cookie exists,
    // explicitly bind it right here to guarantee your BFF accepts the transaction!
    if (xsrfToken) {
      activeHeaders = activeHeaders.set('X-XSRF-TOKEN', xsrfToken);
    }
  }

  // Clone once cleanly and pass it down the execution pipeline
  const modifiedReq = req.clone({ headers: activeHeaders });

  return next(modifiedReq);

};

*/
