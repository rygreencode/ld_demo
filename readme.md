To initialize this Node.js structure please follow the commands below. Assumption is made that Node.js is installed on the local machine and the user has access to a browser to view localhost. 

My server side SDK key is stored locally and not published. If recreating my setup, please reachout to aquire a .ref.json file with the SDK key that can be stored within the same folder as the server.js file. Username and passwords are authenticated by the client based on the key stored on the server. 

1. npm install
2. npm start
3. Server is running at http://localhost:3000

Part 1 - "View on Map" feature can be toggled from LD UI; Listener implemented to allow runtime changes and instant remidiation (in the case of URL failure or poor release)

Part 2 - "Open Support Ticket" functionality limited to admin and select user (Ryan) targeted via user selection with Launch Darkley; context driven by login and allowed for specific users (admin) or users with "manager" role (Ryan and Jane (identified by segment rule))

EC - Expirementation; metrics are being collected as users use (or choose not to use) the "View on Map" feature release, with an expirement running to see if when presented users choose to view their assest live location on a map  - data collection ongoing

EC - Integration; Ryan has integrated LaunchDarkly into his personal Slack Workspace, updates posted to a channel when flags are updated
