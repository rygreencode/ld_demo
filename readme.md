To initialize this Node.js structure please follow the commands below. 
For security reasons, my server side SDK key is stored locally and not pushed to github. If recreating my setup, please reachout if required for running locally
1. npm install
2. npm start
    Server is running at http://localhost:3000

Part 1 - "View on Map" feature can be toggled from LD UI; Listener Implemented to Allow Runtime Changes and Instant Remidiation (in the case of URL failure or poor release)

Part 2 - "Open Support Ticket" functionality limited to admin and select user (Ryan) targeted via user selection with Launch Darkley; context driven by login and allowed for specific users (admin) or users with "manager" role (Ryan and Jane (identified by segment rule))

EC - Expirementation; metrics are being collected as users use (or choose not to use) the "View on Map" feature release, with an expirement running to see if when presented users choose to view their assest live location on a map. 

EC - Integration; Ryan has integrated LaunchDarkly into his personal Slack Workspace, updates posted to a channel when flags are updated