<h1 align="center">Build Management</h1>

### Set up the Development Environment

You need to set up your development environment before you can do anything.

What you need:

* git
* Node.js
* Angular CLI

### Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity-2.0
cd serendipity-2.0/frontend
``` 

### Development

To build the project:

```
# In the project's /frontend directory

ng build --configuration="development" utils-lib && \
ng build --configuration="development" auth-bff-lib && \
ng build --configuration="development" serendipity-components-lib && \
ng build --configuration="development" party-lib && \
ng build --configuration="development" serendipity-web-app
```
       
To launch the project:

```
ng serve serendipity-web-app
```

Navigate to:

```
http://localhost:4200/
```

### Production

To build the project:

```
ng build utils-lib && \
ng build auth-bff-lib && \
ng build serendipity-components-lib && \
ng build party-lib && \
ng build serendipity-web-app
```

The build artifacts will be stored in the `/dist' directory. 

To launch the project using [http-server](https://github.com/indexzero/http-server):

```
http-server -p 4200 -c-1 ./dist/serendipity-web-app
```

Navigate to:

```
http://localhost:4200
```

### Aliases

To add support for aliases update the "paths" array in the `compilerOptions` section of `tsconfig.json`:

```
  "paths": {
    "@app/*": [
      "src/app/*"
    ],
    "@env/*": [
      "src/environments/*"
    ],

    ...
    
  }
```

### Project Assets

You use the assets array inside the build target in `angular.json` to list files or folders you want to copy as-is when building your project:

```
  "assets": [
    "projects/party/src/favicon.ico",
    "projects/party/src/assets"
    ...
  ]
```

### Source Control

Check in:

```
git add .
git commit -m "Updated the README.md file"
git push -u origin main
```

Tag Format:

```
1.0.0-beta.1
```

To create a local tag on your current branch, run this:

```
git tag <tagname>
```

To push the local tags to GitHub:

```
git push origin --tags
```

or

```
git push origin <tag>
```

### Resources

* Github: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* Github: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* Github: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* Github: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* Github: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
