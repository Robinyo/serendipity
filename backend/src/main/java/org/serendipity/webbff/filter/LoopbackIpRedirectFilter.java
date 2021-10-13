package org.serendipity.webbff.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class LoopbackIpRedirectFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

    log.info("LoopbackIpRedirectFilter -> doFilterInternal()");

    if (request.getServerName().equals("localhost") && request.getHeader("host") != null) {

      log.info("LoopbackIpRedirectFilter -> request.getServerName().equals()");

      UriComponents uri = UriComponentsBuilder.fromHttpRequest(new ServletServerHttpRequest(request))
        .host("127.0.0.1").build();
      response.sendRedirect(uri.toUriString());

      return;
    }

    filterChain.doFilter(request, response);

  }

}
