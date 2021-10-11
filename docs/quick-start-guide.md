<h1 align="center">Quick Start Guide</h1>

### Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity-2.0
cd serendipity-2.0/backend
``` 

To serve the applications:

```
docker-compose -f docker-compose-production.yml up -d
```

The containers may take a minute or two to startup.

Navigate to `http://localhost:8080`

You can stop the containers using the following command:

```
docker-compose down -v
```
