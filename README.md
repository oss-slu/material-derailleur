# Material Derailleur

## Overview

The Material Derailleur project by BWorks is designed to streamline the process of managing donations, providing a transparent view into the journey of each donated item. This initiative allows donors to track their contributions from the moment they are donated to their ultimate use, offering them a detailed view of how their items are making a difference. By keeping donors informed about the status and use of their donations, the project fosters a sense of trust and community, encouraging continued support and involvement. The system simplifies the administrative tasks involved in updating and managing donations, making it easier to attract and retain donors who are motivated by seeing the tangible impact of their contributions.

## Tech Stack

- **Client** (`client-app/`): React 19 written in JavaScript and TypeScript, built with Create React App through CRACO, Material UI (MUI) and Tailwind CSS, React Router. Tests run with Jest and React Testing Library.
- **Server** (`server/`): Node.js with Express 5 and TypeScript. Data access uses Prisma with a PostgreSQL database. Item images are stored in Azure Blob Storage, uploaded images are analysed with Google Gemini, and emails are sent with Nodemailer. Tests run with Jest.
- **Containers**: Docker Compose runs the database, the server and the client for development (see below). The database image is PostgreSQL 16.
- **Infrastructure and CI**: `InfrastructureCode/iac.yaml` is an AWS CloudFormation template, and GitHub Actions workflows in `.github/workflows/` build, test, format and publish the code.

## Project Structure

- `client-app/`: the React client. `src/` holds the app (`App.js`, `Components/`, `Modals/`, `constants/`, `css/` and `__tests__/`).
- `server/`: the Express API.
  - `src/routes/`: the HTTP routes (donated items, donors, programs, import and export, password reset and so on).
  - `src/services/`: the logic the routes call (donated items, donors, programs, email, image analysis).
  - `src/validators/`, `src/schemas/`, `src/configs/`, `src/types/` and `src/modals/`: request validators, schemas, configuration (such as the Azure storage setup), types and the model types (`src/modals/`).
  - `src/__tests__/` and `src/__mocks__/`: the Jest tests and their mocks.
  - `prisma/`: the Prisma schema and migrations.
  - `src/generated/`: the Prisma client generated from `prisma/schema.prisma`. It is generated code, so do not edit it by hand.
- `docker-files/`: the Dockerfile and the initialisation script for the PostgreSQL database.
- `InfrastructureCode/`: the CloudFormation template.
- `docs/`: reports and system designs.
- `.github/workflows/`: the GitHub Actions workflows.

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
            - '5435:5432'
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
