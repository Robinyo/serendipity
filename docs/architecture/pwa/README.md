<h1 align="center">Progressive Web App</h1>

## ❯ Introduction

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

For example:

```
 ├── /serendipity
     └── /frontend
         └── /projects
            └── /serendiptiy-pwa (app)
                └── /public
                └── /src
                    └── /app
                        └── /core
                            └── /models
                            └── /error-handlers
                            └── /services
                        └── /features
                            └── /navigation-bar
                            └── /sidenav
                        └── /shared
                            └── /components
                            └── /pipes
                        ├── favicon.ico
                        ├── index.html
            └── /auth-lib (lib)                        
            └── /party-lib (lib)
            └── /work-lib (lib)
            └── /utils-lib (lib)
```

### NgModules

Angular 20 continues to support the use of NgModules, although it strongly encourages and promotes the adoption of 
standalone components, directives, and pipes as the preferred approach for new projects and for migrating existing ones.

While NgModules are still functional, the Angular team recommends transitioning to standalone wherever possible to benefit from:

Reduced boilerplate <br />
Standalone components eliminate the need for declaring components, directives, and pipes within declarations arrays in modules.

Improved tree-shaking <br />
Standalone components can lead to smaller bundle sizes as only the necessary code is included.

Simplified dependency management <br />
Dependencies are directly imported into standalone components, making them easier to track.

Better developer experience <br />
Less configuration and clearer dependency chains can enhance development.

Types of NgModules still in use: <br />

Root Module (AppModule) <br />
The main module of an Angular application, typically responsible for bootstrapping the application.

Feature Modules <br />
Modules that encapsulate a specific feature or domain within an application.

Shared Modules <br />
Modules containing reusable components, directives, and pipes that are shared across multiple feature modules.

Core Modules <br />
Modules that contain singleton services or application-wide functionalities.

Routing Modules <br />
Modules dedicated to defining and managing the application's routes.

Transitioning to Standalone <br />
Angular 20 provides tools and guidance for migrating existing module-based applications to leverage standalone components. <br />
This often involves:
- Removing `NgModule` decorators and related arrays (e.g., declarations, imports, exports).
- Directly importing dependencies into the standalone component files.
- Using the `standalone: true` property in component, directive, and pipe decorators.

## ❯ References

* Angular dev: [Multi-Project Workspace](https://angular.dev/reference/configs/file-structure#multiple-projects)
* Angular dev: [Multiple Project File Structure](https://angular.dev/reference/configs/file-structure#multiple-projects)