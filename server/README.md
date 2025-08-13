# Development Setup

Follow these steps to set up your development environment.

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. If it's not installed, download and install it from [Node.js Official Website](https://nodejs.org/).

- **PostgreSQL**: Ensure that PostgreSQL is installed on your system. If it's not installed, download and install it from [PostgreSQL Official Website](https://www.postgresql.org/download/).

  > **Note**: During PostgreSQL installation, remember to note down the **username** and **password** you set for the PostgreSQL server. You will need these for setting up your `.env` file.

## Step-by-Step Setup

### 1. Set Up PostgreSQL

#### Option 1: Using the Terminal

- **Windows/Linux/Mac**:
  - Open your terminal or command prompt.
  - Run `psql` to enter the PostgreSQL command line interface.
  - Create a new database with the command:
    ```sql
    CREATE DATABASE dbname;
    ```
  - Replace `dbname` with the name you want to give your database.

#### Option 2: Using pgAdmin

- **pgAdmin**:
  - Open pgAdmin and connect to your PostgreSQL server.
  - Right-click on 'Databases', then select 'Create' -> 'Database'.
  - Enter the desired name for your database in the 'Database Name' field and save.

### 2. Navigate to the server directory

To navigate to the server directory where your backend files reside, run:

    cd server

### 3. Create Environment Variables

Create a `.env` file and define the necessary environment variables:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
PORT=5000
AZURE_STORAGE_ACCOUNT_NAME="mdmaproject"
AZURE_STORAGE_ACCESS_KEY="<enter-azure-storage-access-key>"
JWT_SECRET="mymdmaSuperKey"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="enter your gmail"
SMTP_PASS="enter you App password"
FRONTEND_URL="http://localhost:3000/"
```

Replace `username`, `password`, and `dbname` with your PostgreSQL username, password, and the name of the database you created.

Replace `SMTP_USER` with you regular gmail 

Replace `SMTP_PASS` with your App password which is not you regular gmail password

Steps to Generate an App Password for Gmail

1. Go to Google Account Security

    https://myaccount.google.com/security

2. Enable 2-Step Verification (If Not Already Enabled)

    Scroll down to "Signing in to Google".

    Click "2-Step Verification" and complete the setup.

3. Generate an App Password

    Scroll down to "App Passwords" and click on it.

    Select App: Mail.

    Select Device: Other (Custom Name) 

    Click Generate.

    Copy the generated password (it will be a 16-character string, like abcd efgh ijkl mnop).



### 4. Install Dependencies

Run the following command in your project directory to install required dependencies:

    npm install

This command installs all the packages defined in your `package.json` file (both dependencies and devDependencies).

### 5. Run Migrations

To synchronize your database schema with your Prisma model and update the Prisma Client, run:

    npx prisma migrate dev

This command applies all pending migrations to your database and updates the Prisma Client to ensure it matches the new schema. This is crucial for keeping all developers' environments in sync with the latest database schema.

### 6. Start the Development Server

Start your development server by running:

    npm run dev

This command starts the server using `nodemon`, which will automatically restart the server if any changes are detected in your source files.

### 7. Access the Server

Once the server is running, it will be accessible at:

    http://localhost:5000

You can access your API endpoints via this URL using a web browser or tools like Postman for testing API requests.

## Prisma Commands
After updating the Prisma schema, you have to generate migrations to keep your database schema in sync with your application's data model. Use the following command:

``` bash
npx prisma migrate dev --name migration-name
```

For example, if you add a new model called `DonatedItem` to your Prisma schema, you can run:

``` bash
npx prisma migrate dev --name create-donateditem
```
This command creates and applies a new migration based on the changes in your Prisma schema, ensuring your database schema is up-to-date.


## Additional Information

- **Keeping Schema in Sync**: It is important to run migrations whenever changes are made to your Prisma models. This keeps your database schema in sync with your application's data model.
- **Environment Variables**: Ensure that your `.env` file is never committed to your version control system. Add it to your `.gitignore` file to prevent it from being uploaded to shared repositories.

## Troubleshooting Common Issues

### 1. `FATAL: role "postgres" does not exist`

```
# Create the postgres role
createuser postgres
```

---

### 2. `Database "<your-username>" does not exist`

```
# Create a database with your username
createdb <your-username>
```

---

### 3. Port already in use

Change the `.env` file:
```
PORT=5050
```

Restart your server and access via:
```
http://localhost:5050
```

---

### 4. Unable to connect to server in pgAdmin

**Start PostgreSQL:**
```
sudo service postgresql start
```

**Test connection:**
```
psql -U postgres -h localhost
```

**In pgAdmin, use the following connection settings:**
- **Host:** `localhost`
- **Port:** `5432`
- **Username:** `postgres`
- **Password:** *(the one you set earlier)*
```

You can save this as `troubleshooting.md` and it will be ready to use.  

Do you also want me to **add more troubleshooting tips** so the file covers both common PostgreSQL and pgAdmin issues?
