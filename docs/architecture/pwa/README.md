<h1 align="center">Progressive Web App</h1>

### Introduction

A Progressive Web App (PWA) is a type of web application that provides a user experience similar to a native app, 
allowing users to install it on their device for offline access, push notifications, and quick launch from the 
home screen. 

Built with web technologies like HTML, CSS, and JavaScript, PWAs run across all devices and platforms from a single 
codebase, adapting to device capabilities to provide a customized, reliable, and engaging experience.

For more information:
- [web.dev](https://web.dev/explore/progressive-web-apps)
- [mdn](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Setting up for a multi-project workspace

If you intend to have multiple projects in a workspace, you can skip the initial application generation when you create 
the workspace, and give the workspace a unique name. The following command creates a workspace with all of the 
workspace-wide configuration files, but no root-level application.

```
ng new frontend --no-create-application
```

You can then generate applications and libraries with names that are unique within the workspace.

```
cd frontend
ng generate application serendipity-pwa
ng generate library party-lib
ng generate library work-lib
ng generate library utils-lib
```







### Project structure

https://angular.dev/style-guide#project-structure




### Resources

* Angular dev: [Multi-Project Workspace](https://angular.dev/reference/configs/file-structure#multiple-projects)

