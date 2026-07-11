<h1 align="center">Static Content</h1>

## ❯ Spring Boot 

### Static Content

Static content can be served from your Spring Boot application if you place it in the right location. By default, 
Spring Boot serves static content from resources in the classpath at `/static`.

For example:

```
 ├── /serendipity
     └── /backend 
         └── /modules
            └── /web-bff
                └── /src
                    └── /main
                        └── /java
                        └── /resources
                            └── /static
                                ├── 3rdpartylicenses.txt
                                ├── favicon.ico
                                ├── index.html
                                ├── main-2STXNAPZ.js
                                ├── polyfills-EQXJKH7W.js
                                ├── prerendered-routes.json
                                ├── styles-5INURTSO.css
                    └── /test

```

The `index.html` resource is special because, if it exists, it is used as a 'welcome page', which means it is served up 
as the root ('/') resource (that is, at `http://localhost:8080/`).

You can use the [maven-resources-plugin](https://maven.apache.org/plugins/maven-resources-plugin/?ref=rob-ferguson) to copy your resources:

```
	<build>
		<plugins>

			<plugin>
				<artifactId>maven-resources-plugin</artifactId>
				<executions>
					<execution>
						<id>copy-resources</id>
						<phase>validate</phase>
						<goals>
							<goal>copy-resources</goal>
						</goals>
						<configuration>
							<outputDirectory>./target/classes/static/</outputDirectory>
							<resources>
								<resource>
									<directory>../../../frontend/dist/web-ui</directory>
								</resource>
							</resources>
						</configuration>
					</execution>
				</executions>
			</plugin>
            
            ...

		</plugins>
	</build>
```

Alternatively, you can place your Angular source code in your Backend for Frontend's `/webapp` directory:

For example:

```
 ├── /serendipity
     └── /backend 
         └── /modules
            └── /web-bff        
                └── /src
                    └── /main
                        └── /java
                        └── /resources
                        └── /webapp
                            └── /app
                            └── /environments
                            ├── favicon.ico
                            ├── index.html
                            ├── main.ts
                            ├── styles.scss                        
                    └── /test
```

Spring Boot will ignore the `src/main/webapp` directory if your application is packaged as a fat (aka uber) jar.

And you can use the [frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) to run your Angular build:

```
    <build>
        <plugins>

            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>${frontend.maven.plugin.version}</version>
                <executions>
                    <execution>
                        <id>nodeAndNpmSetup</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>npmInstall</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npmRunBuild</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
                <configuration>
                    <nodeVersion>${node.version}</nodeVersion>
                </configuration>
            </plugin>
            
            ...

        </plugins>
    </build>
```
