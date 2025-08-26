<h1 align="center">mkcert</h1>

mkcert is a simple tool for making locally-trusted development certificates. It requires no configuration.

### Create a certificate authority with mkcert

mkcert sets up a locally trusted Certificate Authority (CA), installed into the trust stores on your computer. 
Any certificates issued by this CA will be trusted by the client of your choice (Chrome, Firefox, curl, etc.).

On macOS, you can install mkcert using Homebrew; for other operating systems you can find instructions in the 
[mkcert](https://github.com/FiloSottile/mkcert) docs.

```
brew install mkcert nss
# nss is only needed if you are using Firefox
```

Create and install the certificate authority:

```
mkcert -install
```

You should see something like::

```
Created a new local CA 💥
Sudo password:
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊
```

Use `mkcert` to generate a key and a certificate for the following hostnames:
- `hapi-fhir.au.localhost`
- `keycloak.au.localhost`

```
mkcert -key-file key.pem -cert-file cert.pem hapi-fhir.au.localhost
mkcert -key-file keycloak-key.pem -cert-file keycloak-cert.pem keycloak.au.localhost
```

Move the files into the `\backend\certs` directory and set the file permissions:

```
sudo chmod 600 *.pem
```

**Note:** On Unix and MacOS systems the cert and key file permissions must disallow any access to world or group.

### Create a PKCS12 Keystore

You can use `openssl` to create a PKCS12 keystore:

```
openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name tomcat -password pass:secret
```

**Note:** On Unix and MacOS systems the cert and key file permissions must disallow any access to world or group.

### /etc/hosts

Update your `/etc/hosts` file:

```
sudo nano /etc/hosts
```

Add the hostnames, `hapi-fhir.au.localhost` and `keycloak.au.localhost`:

```
127.0.0.1 localhost hapi-fhir.au.localhost keycloak.au.localhost
```

**Note**: Remember that `mkcert` is meant for development purposes, not production, so it should not be used on end 
users' machines, and that you should not export or share `rootCA-key.pem`.

### View and manage digital certificates

You can also use command-line tools to view and manage digital certificates.

For example:

```
curl -v https://provider-directory.au.localhost
openssl x509 -in certs/cert.pem -text -noout
nmap --script ssl-cert -p 443 provider-directory.au.localhost
```

## ❯ References

* GitHub: [mkcert](https://github.com/FiloSottile/mkcert)
