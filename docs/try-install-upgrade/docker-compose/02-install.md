# Install and start

## Install and start Serendipity with Docker Compose

To start the default lightweight Serendipity environment locally:

1. Change the current working directory to the location where you want the cloned project to be:

```
cd ~/workspace
```
2. Clone the project by running the following command:

```
git clone git@github.com:Robinyo/serendipity.git
``` 

3. In the project's `/backend` directory, run

```
docker compose -f docker-compose-try.yml up -d
```

For available Compose files, component URLs, and authentication defaults, see [configure Docker Compose environments](./03-configure.md).

## Stop Serendipity with Docker Compose

To stop all containers and remove associated data, run:

```
docker compose -f docker-compose-try.yml down -v

# Or for the full configuration:
docker compose -f docker-compose-try-full.yml down -v
```

:::warning

The `-v` flag deletes all volumes, including process data, users, and other persisted state. Omit `-v` if you want to keep your data.
