# Configuration

## Authentication and authorization

To toggle authentication and authorization on/off dynamically during development, we utilise a Property-Driven Security 
Configuration in the Spring Boot BFF paired with a Dynamic User Provider in the Angular PWA.

### Authentication feature flag

The BFF's `application.yml` has an authentication feature flag:

```
serendipity-web-bff:
  auth:
    enabled: false
```

When `auth.enabled=false`, we bypass Spring Security filters and inject a static mock Principal and mock headers for 
downstream services:

```
@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "serendipity-bff.auth.enabled", havingValue = "false", matchIfMissing = true)
@EnableAutoConfiguration(exclude = { OAuth2ClientAutoConfiguration.class })
public class DisabledAuthSecurityConfig {

  @Bean
  public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
      .build();
  }
}
```
