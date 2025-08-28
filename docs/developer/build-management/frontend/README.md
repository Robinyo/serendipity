<h1 align="center">Frontend Build Management</h1>

### Set up your Development Environment

You need to set up your development environment before you can do anything.

What you need:

* git
* Node.js
* Angular CLI

### Node.js

#### macOS

To install Node.js using Homebrew on macOS, follow these steps:

```
brew update
brew upgrade
brew install node
```

After the installation completes, you can verify that Node.js and npm (Node Package Manager, which comes bundled with Node.js) are installed correctly by checking their versions:

```
node -v
npm -v
```

### Angular CLI

Angular requires an active LTS or maintenance LTS version of Node.js. See Angular's [version](https://angular.dev/reference/versions) compatibility guide for more information.

To install the Angular CLI, open a terminal window and run the following command:

```
npm install -g @angular/cli
```

### Development

To build the frontend:

```
# In the project's /frontend directory

ng build --configuration="development"
```

### Production

To build the frontend:

```
# In the project's /frontend directory

ng build
```

### References

* Angular dev: [Angular CLI](https://angular.dev/cli)
* Angular dev: [Angular Style Guide](https://angular.dev/style-guide)
* Material Angular dev: [Getting Started with Angular Material](https://material.angular.dev/guide/getting-started)

### Additional Resources

* Github: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* Github: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* Github: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* Github: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* Github: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
