# Treeloc frontend

For full experience [Treeloc Backend](https://github.com/prixladi/treeloc-backend) should be running on developement machine.

# Launching the project

## Docker (docker-compose)

Start the project using `docker-compose up`

Create new images and start the project using `docker-compose up --build`

**Frontend** service should be running on port **80**. Port mapping can be changed in the **./docker-compose.yml** file.

[docker-compose documentation.](https://docs.docker.com/compose/)

---

## Yarn

Project init `yarn`

Project launch `yarn start`

App should be running on port **3000**.

---

# Environment variables
Environment variables can be changed in the **./docker-compose.yml** file.

|Name|Optional|Description|
|---|---|---|
|API_URL|no| **Api** Service address|
|LOADER_URL|no| **Loader** Service address|
