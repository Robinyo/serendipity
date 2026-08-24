# Environment

## macOS

To get started, you need to set up your development environment.

What you need:
* git
* NVM
* Node and npm
* Java JDK 25 or later
* Maven 3.9.12 or later
* mkcert

You also need to:
* Update your `/etc/hosts` file

An editor is also required, we recommend IntelliJ IDEA.

### Homebrew

If you haven't already, install Homebrew (The Package Manager for Everywhere):

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

To upgrade Homebrew, run:

```
brew update && \
brew upgrade
```

### git

To install git, run

```
brew install git
```

To configure git so that it uses `nano`, run:

```
git config --global core.editor "nano"
```

### NVW

To install NVW, run:

```
brew install nvm
```

Create the NVM Directory:

```
mkdir ~/.nvm
```

Add the following to your shell profile e.g. `~/.zshrc`:
```
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

Apply the changes to your current terminal session:

```
source ~/.zshrc
```

Confirm that NVM is installed correctly by checking its version:

```
nvm --version
```

### Node and npm

To install Node and npm run:

```
nvm install node
```

To install a specific version (e.g., version 20) of Node:

```
nvm install 24
```

To switch to a specific version:

```
nvm use 24
nvm alias default 24
```

To list your installed versions:

```
nvm ls
```

To confirm that Node and npm are installed correctly, run:

```
node --version
npm --version
```

### Java JDK

Homebrew tap `AdoptOpenJDK/openjdk` is officially deprecated in favor of the temurin casks provided directly from the 
Homebrew project. Homebrew is the best way to manage and work with different Java versions.

For example:

```
brew install --cask temurin@25
```

Update your `.zshrc`:

```
export JAVA_11_HOME=$(/usr/libexec/java_home -v11)
export JAVA_17_HOME=$(/usr/libexec/java_home -v17)
export JAVA_21_HOME=$(/usr/libexec/java_home -v21)
export JAVA_24_HOME=$(/usr/libexec/java_home -v24)
export JAVA_25_HOME=$(/usr/libexec/java_home -v25)

alias java11='export JAVA_HOME=$JAVA_11_HOME'
alias java17='export JAVA_HOME=$JAVA_17_HOME'
alias java21='export JAVA_HOME=$JAVA_21_HOME'
alias java24='export JAVA_HOME=$JAVA_24_HOME'
alias java25='export JAVA_HOME=$JAVA_25_HOME'

java25
```

To check your Java version:

```
source ~/.zshrc
java -version
```

You should see something like:

```
openjdk version "21.0.9" 2025-10-21 LTS
OpenJDK Runtime Environment Temurin-21.0.9+10 (build 21.0.9+10-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.9+10 (build 21.0.9+10-LTS, mixed mode, sharing)
```

To check for installed Java SDKs:

```
/usr/libexec/java_home -V
```

You should see something like:

```
Matching Java Virtual Machines (5):
25.0.1 (arm64) "Eclipse Adoptium" - "OpenJDK 25.0.1" /Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home
21.0.9 (arm64) "Eclipse Adoptium" - "OpenJDK 21.0.9" /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
17.0.17 (arm64) "Eclipse Adoptium" - "OpenJDK 17.0.17" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
11.0.29 (arm64) "Eclipse Adoptium" - "OpenJDK 11.0.29" /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home
```

### Maven

To install Maven, run:

```
brew install maven
```

Confirm that Maven is installed correctly by checking its version:

```
mvn -v
```

### mkcert

mkcert is a tool for making locally-trusted development certificates. It requires no configuration.

#### Create a certificate authority with mkcert

mkcert sets up a locally trusted Certificate Authority (CA), installed into the trust stores on your computer.
Any certificates issued by this CA will be trusted by the client of your choice (Chrome, Firefox, curl, etc.).

```
brew install mkcert nss
```

:::tip

`nss` is only needed if you are using Firefox.

:::

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
- serendipity.localhost
- serendipity-identity-service.localhost

In the `\backend\certs` directory:

```
mkcert -key-file serendipity.localhost-key.pem -cert-file serendipity.localhost-cert.pem serendipity.localhost
mkcert -key-file serendipity-identity-service.localhost-key.pem -cert-file serendipity-identity-service.localhost-cert.pem serendipity-identity-service.localhost
```

Set the file permissions:

```
chmod 600 *.pem && \
xattr -c *.pem
```

:::tip

On Unix and macOS systems the cert and key file permissions must disallow any access to world or group.

I also had an issue with Docker Compose mounting the `*.pem` files if they have extended attributes.
On macOS, the `@` symbol at the end of a file's permissions means the file has extended attributes.

To remove them, run:

```
xattr -c *.pem
```

:::

#### Create a PKCS12 Truststore

You can use `openssl` to create a PKCS12 truststore:

```
keytool -importcert -trustcacerts \
  -file "$(mkcert -CAROOT)/rootCA.pem" \
  -alias mkcertCA \
  -keystore truststore.p12 \
  -storetype PKCS12 \
  -storepass secret \
  -noprompt
```

Set the file permissions:

```
chmod 600 *.p12 && \
xattr -c *.p12
```

### /etc/hosts

Update your `/etc/hosts` file:

```
sudo nano /etc/hosts
```

Add the hostnames, `serendipity.localhost` and `serendipity-identity-service.localhost`:

```
127.0.0.1 localhost serendipity.localhost serendipity-identity-service.localhost
```

:::danger

Remember that `mkcert` is meant for development purposes, not production, so it should not be used on end
users' machines, and you should not export or share `rootCA-key.pem`.

:::

### View and manage digital certificates

You can also use command-line tools to view and manage digital certificates.

For example:

```
curl -v https://serendipity.localhost
openssl x509 -in certs/cert.pem -text -noout
nmap --script ssl-cert -p 443 serendipity.localhost
```
