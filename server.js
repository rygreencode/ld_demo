// Import the Express library, which is a framework for building web servers.
const express = require('express');
// Import the path module, which helps in working with file and directory paths.
const path = require('path');
// Import the file system module (fs) to read files, such as the LaunchDarkly SDK key.
const fs = require('fs');
// Import the LaunchDarkly Node.js SDK for feature flag management.
const LaunchDarkly = require('@launchdarkly/node-server-sdk');

// Create an instance of the Express application.
const app = express();
// Define the port number the server will listen on. Use 3000 as a common default.
const PORT = 3000;

// Add body parsing middleware for JSON
app.use(express.json());

// --- User List ---
const USERS = [
  { username: 'admin', password: 'password' },
  { username: 'ryan', password: 'pass' },
  { username: 'john', password: 'pass1' },
  { username: 'jane', password: 'pass2' },
];

// --- Login API Endpoint ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid username or password.' });
  }
});
// --- LaunchDarkly Server-Side Initialization ---
let ldSdkKey = '';
try {
  const refData = JSON.parse(fs.readFileSync(path.join(__dirname, '.ref.json'), 'utf8'));
  ldSdkKey = refData.SDKKEY || '';
} catch (err) {
  console.error('Could not read LaunchDarkly SDK key from .ref.json:', err);
}
const ldServerClient = LaunchDarkly.init(ldSdkKey);

// --- Main Application Logic (in an async function) ---
// We create an immediately-invoked async function to use 'await' at the top level.
(async () => {
  try {
    // 1. Await SDK initialization.
    await ldServerClient.waitForInitialization();
    console.log('SDK successfully initialized!');

  } catch (error) {
    console.error("Error during LaunchDarkly initialization or flag evaluation:", error);
  }
})();

// --- Middleware ---
// This line tells Express to serve static files (like HTML, CSS, images, and client-side JS)
// from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// This is the key part for using our npm package on the front-end.
// It creates a virtual path '/scripts' that maps to the 'node_modules' directory.
// This allows our HTML to access the LaunchDarkly library file.
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));

// --- Server Start ---
// Start the server and make it listen for incoming requests on the specified port.
app.listen(PORT, () => {
  // This message will be logged to your terminal when the server starts successfully.
  console.log(`Server is running at http://localhost:${PORT}`);
});