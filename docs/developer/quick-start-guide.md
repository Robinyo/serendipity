<h1 align="center">Quick Start Guide</h1>

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Open a terminal window and install [Node.js (and npm)](https://nodejs.org/en/download/) and [git](https://git-scm.com/) if they are not already on your machine.

> Verify that you are running at least Node.js version 8.x or greater and npm version 5.x or greater by running node -v and npm -v in a terminal/console window. Older versions produce errors, but newer versions are fine.

Then install the Angular CLI globally:

```
npm install -g @angular/cli
```

The [Angular CLI](https://cli.angular.io/) is a command line tool that you can use to create the scaffolding for a new project, add files to a project and perform a variety of common development tasks.

### Step 2: Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity
cd serendipity
```

### Step 3: Serve the application's API 

Follow the steps in the Serendipity API's [Quick Start Guide](https://github.com/Robinyo/serendipity-api/blob/master/projects/spring-boot/docs/developer/quick-start-guide.md).

### Step 4: Serve the application 

Install the project's dependencies and launch the application:

```
# In the project directory: /serendipity

npm install

ng build utils && \
ng build serendipity-components && \
ng build auth && \
ng build auth-oidc && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build flowable && \
ng build sales && \
ng build work 

ng serve --open
```

The `ng serve` command launches the server, watches your files, and rebuilds the app as you make changes to those files.

Using the --open (or just -o) option will open your browser on `http://localhost:4200/`

Register page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-register.png">
</p>

Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-login.png">
</p>
