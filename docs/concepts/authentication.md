# Authentication

## Backend-for-Frontend (BFF) Token Relay Architecture

Serendipity implements a secure Backend-for-Frontend (BFF) Token Relay Architecture that uses the OAuth2 Authorization Code Flow. 

Using this enterprise security pattern, the Angular PWA never sees, stores, or handles raw access tokens or refresh tokens. 
Instead, the Spring Boot BFF Gateway handles all token cryptography and secures the user's session using encrypted, `HttpOnly`, `SameSite` cookies.

## The Authenticated Login Lifecycle Steps

The AuthN flow unfolds step-by-step after the user lands on the Welcome page and clicks the Login button:

### Step 1: Landing on the Welcome (Home) Page
The user safely accesses your public landing routes. At this point, the client instance is operating in an 
anonymous / unauthenticated state.

### Step 2: Clicking the "Login" Target Link
Instead of rendering an internal login form component or parsing plain text password inputs, the login link triggers an 
intentional backend challenge route. It can do this in one of two ways:
- **The Direct Link approach**: The button points straight to your BFF OAuth initiation endpoint: <br />
  `<a href="/oauth2/authorization/keycloak">Login</a>`.
- **The Client-Intercept approach**: The application makes a quick proxy lookup call to `/api/me`.

### Step 3: Server Handshake Transition & The Authorization Redirect
The moment the request hits the BFF `/oauth2/authorization/keycloak` gateway proxy path, Spring Security kicks off the 
OAuth2 handshake sequence. It generates a cryptographic `state` and a temporary `code_verifier` challenge string.
The server then responds with an HTTP `302 Found` redirect status code, prompting the browser to update its address window:

```
HTTP/1.1 302 Found
Location: https://serendipity-identity-service.localhost/...
```

### Step 4: Login at Identity Provider
The user's browser bounces completely out of the Angular PWA and lands on the Indentity Services (Keycloak) realm login screen.
- The user inputs their corporate credentials (username/password, MFA, or Single Sign-On).
- Keycloak validates the user credentials against the secure identity directory.

### Step 5: Authorization Code Handback Call
Upon successful authentication, the Indentity Services (Keycloak) issues a temporary, single-use tracking string called an **Authorization Code**.
Keycloak redirects the browser window back to the BFF's registered redirect URI, stamping the authorization code onto the URL parameters:

```
GET https://serendipity.localhost
```

### Step 6: Backend Token Exchange Pass
The Angular PWA hasn't reloaded yet — this callback URL is intercepted cleanly by your Spring Boot BFF Gateway.
- The BFF extracts the temporary code parameter.
- The BFF makes a secure, back-channel server-to-server HTTP request directly to Keycloak's `/token` endpoint, 
  exchanging the code and your confidential `client_secret` string for official **Access, Refresh, and ID JSON Web Tokens (JWTs)**.

### Step 7: Establishing the Secure Cookie Session Matrix
Once the BFF receives the JWT array from Keycloak, it saves them securely inside its server-side session index memory. 
It then completes the login cycle by returning an HTTP cookie header back to the browser client:

```
Set-Cookie: SESSION=NzM0Mm...; Secure; HttpOnly; SameSite=Strict; Path=/
```

### Step 8: App Reload and Successful Verification
The BFF routes the browser back to your root Angular application context path. The **APP_INITIALIZER** pipeline 
executes again, firing a new request to `/api/me`. This time, the browser automatically sends the secure `SESSION` cookie 
along with the request. The BFF validates the cookie, extracts your profile details, and returns a successful `200 OK` 
JSON profile response payload! The PWA updates its internal reactive signals, toggles the navigation bar, command bar 
and sidenav menus open, and safely lets the user into their secure workspace canvas.

### Responsibility Summary Table

| Component           | Responsibility                                                                                                                   |
|:--------------------|:---------------------------------------------------------------------------------------------------------------------------------|
| Angular&nbsp;PWA    | Manages UI presentation state. Only handles user profile JSON objects, completely isolated from raw cryptographic token strings. |
| BFF&nbsp;Gateway    | Acts as the confidential OAuth Client. Holds the `client_secret`, exchanges codes, and manages session cookies.                  |
| Keycloak&nbsp;(IdP) | Acts as the Identity Provider. Authenticates users, enforces passwords/MFA, and issues cryptographically signed JWT strings.     |

