# Development Setup

Follow these steps to set up your development environment for the client-side application.

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. If it's not installed, you can download and install it from the [Node.js Official Website](https://nodejs.org/).

## Step-by-Step Setup

### 1. Navigate to the client-app directory

To navigate to the server directory where your backend files reside, run:

    cd client-app

### 2. Create Environment Variables

Create a `.env` file and define the necessary environment variables:

```plaintext
REACT_APP_BACKEND_API_BASE_URL="http://localhost:5000/"
```

### 3. Install Dependencies

Run the following command in your project directory to install required dependencies:

    npm install

Installs all the packages defined in your `package.json` file (both dependencies and devDependencies).

### 4. Start the Development Server

Run the following command to start the app in development mode:

    npm start

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits. You may also see any lint errors in the console.

### 5. Running Tests

To launch the test runner in the interactive watch mode, run:

    npm test

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### 6. Build the Application

To build the app for production to the `build` folder, run:

    npm run build

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include the hashes. Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Additional Resources

- [Go to Root Folder README](https://github.com/oss-slu/material-donor-mutual-assist/blob/main/README.md)
- [Server Setup Guide](https://github.com/oss-slu/material-donor-mutual-assist/blob/main/server/README.md).