// --- DOM Elements ---
const bodyElement = document.body;
const loginContainer = document.getElementById('login-container');
const deviceContainer = document.getElementById('device-container');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button');
const deviceTableBody = document.getElementById('device-table-body');

// Make showOpenTicketButton available globally before LD SDK uses it
window.showOpenTicketButton = function(show) {
    var btn = document.getElementById('open-ticket-btn');
    if (btn) btn.style.display = show ? '' : 'none';
};

// Example of initializing the LaunchDarkly client.
const context = {
  kind: 'user',
  key: 'Anon',
  name: 'Anon',
  email: 'Anon@exmaple.com'
};
const client = LDClient.initialize('685ef6fdf579d209526f4cc4', context);
console.log("LaunchDarkly Client Initialized:", client);

client.on('initialized', function () {
  console.log('SDK successfully initialized!');
  const flagValue = client.variation('subscribe-toggle-feature', false);
  const showTicketBtn = client.variation('open-ticket-btn', true);
  window.showOpenTicketButton(showTicketBtn);
  console.log("subscribeTogger is: " + flagValue);
  console.log("showTicket is: " + showTicketBtn);
  renderDeviceTable(flagValue);
});

client.on('ready', () => {
  console.log('LD client is ready!');
  const flagValue = client.variation('subscribe-toggle-feature', false);
  const showTicketBtn = client.variation('open-ticket-btn', true);
  window.showOpenTicketButton(showTicketBtn);
  renderDeviceTable(flagValue);
  // Subscribe to changes for a specific flag
  client.on('change:subscribe-toggle-feature', (currentValue, previousValue) => {
    console.log(`Flag 'subscribe-toggle-feature' changed from ${previousValue} to ${currentValue}`);
    renderDeviceTable(currentValue);
  });
  client.on('change:open-ticket-btn', (currentValue, previousValue) => {
    window.showOpenTicketButton(currentValue);
  });
});


// --- Sample Device Data ---
const devices = [
    { id: 'DEV-001', name: 'Field Sensor Alpha', status: 'Online', lat: 34.0522, lon: -118.2437 },
    { id: 'DEV-002', name: 'Vehicle Tracker Bravo', status: 'Online', lat: 40.7128, lon: -74.0060 },
    { id: 'DEV-003', name: 'Asset Tag Charlie', status: 'Offline', lat: 41.8781, lon: -87.6298 },
    { id: 'DEV-004', name: 'Logistics Container Delta', status: 'Online', lat: 29.7604, lon: -95.3698 },
    { id: 'DEV-005', name: 'Weather Station Echo', status: 'Maintenance', lat: 39.9526, lon: -75.1652 },
    { id: 'DEV-006', name: 'Shipping Pallet Foxtrot', status: 'Online', lat: 32.7767, lon: -96.7970 }
];

// --- Functions ---
function renderDeviceTable(showMap = false) {
    deviceTableBody.innerHTML = '';
    // Build table header
    const tableHead = document.getElementById('device-table-head');
    if (tableHead) {
        let headerRow = `<tr>
            <th class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">ID</th>
            <th class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">Name</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Status</th>
            <th class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">Latitude</th>
            <th class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">Longitude</th>`;
        if (showMap) {
            headerRow += `
            <th class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">Map</th>`;
        }
        headerRow += `</tr>`;
        tableHead.innerHTML = headerRow;
    }
    devices.forEach(device => {
        const statusColor = getStatusColor(device.status);
        let row = `<tr class="hover:bg-gray-50 transition-all">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">${device.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">${device.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">${device.status}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">${device.lat}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">${device.lon}</td>`;
        if (showMap) {
            row += `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <a href="https://www.google.com/maps?q=${device.lat},${device.lon}" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline">View on Map</a>
            </td>`;
        }
        row += `</tr>`;
        deviceTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'online': return 'bg-green-100 text-green-800';
        case 'offline': return 'bg-red-100 text-red-800';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function showDeviceList(showMap = false) {
    bodyElement.classList.remove('items-center');
    loginContainer.style.display = 'none';
    deviceContainer.style.display = 'block';
    renderDeviceTable(showMap);
}

function showLogin() {
    bodyElement.classList.add('items-center');
    deviceContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    errorMessage.style.display = 'none';
    if(loginForm) loginForm.reset();
}

// --- Event Listeners ---
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        // Validate against server
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success) {
                //establish user role based on username
                let userrole = 'none'; // Default role
                if (username === 'admin') {
                    userrole = 'admin';
                } else if (username === 'ryan' || username === 'jane') {
                    userrole = 'manager';
                }
                // Set new context and Identify User for LaunchDarkly here
                const context = {
                    kind: 'user',
                    key: username,
                    name: username,
                    email: username + '@example.com',
                    role: userrole
                };
                client.identify(context, null, function() {
                    const flagValue = client.variation('subscribe-toggle-feature', false);
                    console.log(username + "'s flag value is: " + flagValue);
                    const showTicketBtn = client.variation('open-ticket-btn', true);
                    console.log("showTicket is: " + showTicketBtn);
                    showDeviceList(flagValue);
                });
            } else {
                errorMessage.textContent = result.message || 'Invalid username or password.';
                errorMessage.style.display = 'block';
            }
        } catch (err) {
            errorMessage.textContent = 'Server error. Please try again.';
            errorMessage.style.display = 'block';
        }
    });
}

if(logoutButton) {
    logoutButton.addEventListener('click', () => {
        showLogin();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Ticket modal logic
    const openBtn = document.getElementById('open-ticket-btn');
    const modal = document.getElementById('ticket-modal');
    const closeBtn = document.getElementById('close-ticket-btn');
    const form = document.getElementById('ticket-form');
    if (openBtn && modal && closeBtn && form) {
        openBtn.onclick = () => { modal.style.display = 'flex'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        form.onsubmit = (e) => {
            e.preventDefault();
            modal.style.display = 'none';
            client.track("example-event-key", context);
            form.reset();
            // No further action for demo
        };
    }
});
