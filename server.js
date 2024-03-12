// Import the express module to create an HTTP server for our API
const express = require('express');

// Initialize the express application
const app = express();

// Determine the server port from the environment for flexibility in different
// environments (development, production, etc.), with a default port fallback
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies. This allows us to automatically parse JSON payloads in
// the requests, making it easier to work with JSON data sent by clients.
app.use(express.json());

// Import the routes definitions from a separate file to keep the routing logic organized and modular.
// This improves maintainability by separating concerns.
const routes = require('./routes');

// Apply the imported routes to the app. All routes are prefixed with '/', serving as the base URI for our API.
app.use('/', routes);

// Start listening on the specified port. The callback function confirms that the server has started successfully.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
