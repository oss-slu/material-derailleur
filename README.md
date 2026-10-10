# Material Derailleur

## Overview
The Material Derailleur project by BWorks is designed to streamline the process of managing donations, providing a transparent view into the journey of each donated item. This initiative allows donors to track their contributions from the moment they are donated to their ultimate use, offering them a detailed view of how their items are making a difference. By keeping donors informed about the status and use of their donations, the project fosters a sense of trust and community, encouraging continued support and involvement. The system simplifies the administrative tasks involved in updating and managing donations, making it easier to attract and retain donors who are motivated by seeing the tangible impact of their contributions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Develop With Docker Compose

### Prerequisites
Ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop/)

### Clone the Repository
Clone the repository to your local machine.
```
git clone https://github.com/oss-slu/material-donor-mutual-assist.git
```

### Navigate to the Project Directory  
Move into the project folder.
```
cd material-donor-mutual-assist
```

## Create Environment Variables

Copy the template to a `.env` file in the repository root, then fill in the
secrets (Azure, Gemini, SMTP):

```
cp .env.example .env
```

`.env.example` documents every variable the services read. Two of them cause
most setup failures, so check these first if something does not work:

- **`DATABASE_URL`** must use the compose hostname `mdma-database-container`.
  Using `localhost` here resolves to the backend container itself and fails
  with `P1001: Can't reach database server`. If your password contains any of
  `@ : / ? # [ ]`, percent-encode it (`p@ss` becomes `p%40ss`).
- **`REACT_APP_BACKEND_API_BASE_URL`** must use host port **5050**, not 5000.
  The backend listens on 5000 inside its container, but compose publishes it
  on 5050. This value is used by the browser, so it needs the host port.

Your `.env` is gitignored — never commit it.

### Start the Development Environment

Run the following command to build and start the services:
```
docker compose up -d
```
This will start all necessary containers in the background. On the first run
the backend applies all database migrations before it starts serving, which
takes a minute or so.

### Accessing the Application
After the application starts, navigate to http://localhost:3000 in your web browser.

### Create the First Admin Account

Accounts registered through the app start with status `PENDING`, and approving
an account requires an admin who is already `ACTIVE`. On a new database there
is none, so the first account has to be activated directly in the database.

Register at http://localhost:3000/register, then run:

```
docker exec mdma-database-container psql -U admin -d mdma \
  -c "UPDATE \"User\" SET status='ACTIVE' WHERE email='your@email.com';"
```

The double quotes around `"User"` are required — PostgreSQL lowercases
unquoted identifiers, and `user` is a reserved word.

Log out and back in afterwards, because your account status is embedded in the
JWT issued at login. You can then approve everyone else from
**Admin → User Management** (http://localhost:3000/admin/user-management), and
this command should not be needed again.

### Stop the Development Environment

To stop the containers while keeping the database:
```
docker compose stop
```

To remove the containers (the database volume is kept, so your data survives):
```
docker compose down
```

To also delete the database and start completely fresh:
```
docker compose down -v
```

### Troubleshooting

**`address already in use` on startup.** Another service holds one of the
published ports — most often a PostgreSQL installed directly on your machine
using 5432. Either stop it, or remap the host port without editing the
committed compose file by creating `docker-compose.override.yml` (gitignored):

```yaml
services:
  mdma-database:
    ports: !override
      - "5435:5432"
```

Containers reach each other over the compose network, so this only changes how
you connect from your own machine (`psql -h localhost -p 5435`).

**`CORS request did not succeed` / `NetworkError` in the browser.** Either the
frontend is calling the wrong port (see `REACT_APP_BACKEND_API_BASE_URL`
above), or you are running the frontend on a port that is not allow-listed. Add
it to `CORS_ALLOWED_ORIGINS` in `.env` as a comma-separated list, for example
`"http://localhost:3000,http://localhost:3001"`, then recreate the backend:

```
docker compose up -d mdma-backend
```

Use `up -d`, not `docker compose restart` — `restart` reuses the container's
existing environment and silently ignores changes to `.env`.

## Development Setup

Follow these steps to set up your development environment.

### Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. If it's not installed, download and install it from the [Node.js Official Website](https://nodejs.org/).

### Installation

1. **Clone the Repository**:  
   Clone the repository to your local machine.

    ```bash
    git clone https://github.com/oss-slu/material-donor-mutual-assist.git
    ```

2. **Navigate to the Project Directory**:  
   Move into the project folder.

    ```bash
    cd material-donor-mutual-assist
    ```

3. **Install Dependencies**:  
   Run the following command in your project directory to install the required dependencies:

    ```bash
    npm install
    ```

    This command installs all the packages defined in your `package.json` file (both dependencies and devDependencies).

### Frontend Setup

The frontend application is located in the `client-app` folder.  
Follow the instructions provided in the [Frontend Setup Guide](https://github.com/oss-slu/material-donor-mutual-assist/blob/main/client-app/README.md).

### Server Setup

The Node.js server resides in the `server` folder, which communicates with a PostgreSQL database.  
Follow the instructions provided in the [Server Setup Guide](https://github.com/oss-slu/material-donor-mutual-assist/blob/main/server/README.md).

## Code Formatting

We use Prettier to ensure consistent code formatting across the project. Before pushing your code to the remote repository, follow these steps:

1. **Format the Code**:  
   To automatically format your code, run the following command:

    ```bash
    npm run prettier:write
    ```

2. **Check Code Formatting**:  
   After formatting, run this command to ensure everything is properly formatted:

    ```bash
    npm run prettier:check
    ```

   Only push the code to the repository once all formatting issues have been resolved.

## Container Images, SBOMs, and Provenance

Every push to `main` runs the [build-and-push workflow](.github/workflows/build-and-push.yml), which publishes the `server` and `client` images to `ghcr.io/oss-slu/material-derailleur/server` and `ghcr.io/oss-slu/material-derailleur/client`. For each image, the workflow also:

- Generates a Software Bill of Materials (SBOM) in SPDX JSON format with [Syft](https://github.com/anchore/syft). The SBOM lists the packages inside the published image.
- Creates a signed build provenance attestation for the image digest. The attestation records the repository, commit, and workflow that built the image.

### Download an SBOM

Open a run of the [build-and-push workflow](https://github.com/oss-slu/material-derailleur/actions/workflows/build-and-push.yml) and download `sbom-server` or `sbom-client` from the **Artifacts** section of the run summary.

### Verify an Image

The run summary also links to each image's attestation, which shows the image digest. To check that an image was built by this repository's workflow, run this with the [GitHub CLI](https://cli.github.com/):

```bash
gh attestation verify oci://ghcr.io/oss-slu/material-derailleur/server@sha256:<digest> --repo oss-slu/material-derailleur
```

The images are private, so log in to GHCR with `docker login ghcr.io` first. Verification proves where and how an image was built. It does not mean the image is free of vulnerabilities.