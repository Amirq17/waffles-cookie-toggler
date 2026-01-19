// Get current tab URL to set cookie for the correct domain
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Get the cookie value
async function getCookie(url) {
  const urlObj = new URL(url);
  const cookie = await chrome.cookies.get({
    url: url,
    name: 'waffles'
  });
  return cookie;
}

// Set or remove the cookie
async function toggleCookie(url, currentValue) {
  const urlObj = new URL(url);

  // Get domain (use hostname, Chrome will handle the domain properly)
  const domain = urlObj.hostname;

  try {
    if (currentValue) {
      // Remove the cookie
      console.log('Removing cookie for:', domain);
      await chrome.cookies.remove({
        url: url,
        name: 'waffles'
      });
      return false;
    } else {
      // Set the cookie with expiration date (1 year from now)
      const expirationDate = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

      console.log('Setting cookie for:', domain);
      const result = await chrome.cookies.set({
        url: url,
        name: 'waffles',
        value: 'true',
        path: '/',
        secure: urlObj.protocol === 'https:',
        sameSite: 'lax',
        expirationDate: expirationDate
      });

      if (!result) {
        throw new Error('Failed to set cookie');
      }

      return true;
    }
  } catch (error) {
    console.error('Error toggling cookie:', error);
    throw error;
  }
}

// Update icon with green or red border based on cookie state
async function updateIcon(isEnabled) {
  try {
    if (isEnabled) {
      // Green border when cookie is on
      await chrome.action.setIcon({
        path: {
          "16": "icon-green-16.png",
          "48": "icon-green-48.png",
          "128": "icon-green-128.png"
        }
      });
    } else {
      // Red border when cookie is off
      await chrome.action.setIcon({
        path: {
          "16": "icon-red-16.png",
          "48": "icon-red-48.png",
          "128": "icon-red-128.png"
        }
      });
    }
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Update UI based on cookie state
function updateUI(isEnabled) {
  const button = document.getElementById('toggleBtn');
  const status = document.getElementById('status');

  if (isEnabled) {
    button.textContent = 'Disable Waffles';
    button.className = 'on';
    status.textContent = 'Cookie: waffles=true';
    status.className = 'status on';
  } else {
    button.textContent = 'Enable Waffles';
    button.className = 'off';
    status.textContent = 'Cookie: not set';
    status.className = 'status off';
  }

  // Update the icon with border
  updateIcon(isEnabled);
}

// Initialize
async function init() {
  try {
    const tab = await getCurrentTab();

    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }

    console.log('Current tab URL:', tab.url);

    const cookie = await getCookie(tab.url);
    const isEnabled = cookie && cookie.value === 'true';

    console.log('Current cookie state:', isEnabled);
    updateUI(isEnabled);

    // Add click handler
    const button = document.getElementById('toggleBtn');
    button.addEventListener('click', async () => {
      // Prevent multiple clicks
      button.disabled = true;
      button.textContent = 'Processing...';

      try {
        const currentCookie = await getCookie(tab.url);
        const currentValue = currentCookie && currentCookie.value === 'true';

        console.log('Toggling from:', currentValue);
        const newValue = await toggleCookie(tab.url, currentValue);
        console.log('Toggled to:', newValue);

        updateUI(newValue);

        // Automatically reload the page to apply the cookie change
        button.textContent = 'Reloading...';
        await chrome.tabs.reload(tab.id);

        // Close the popup after reload
        window.close();
      } catch (error) {
        console.error('Toggle failed:', error);
        alert('Failed to toggle cookie: ' + error.message);

        // Refresh UI to current state
        const refreshedCookie = await getCookie(tab.url);
        const refreshedState = refreshedCookie && refreshedCookie.value === 'true';
        updateUI(refreshedState);
      } finally {
        button.disabled = false;
      }
    });
  } catch (error) {
    console.error('Initialization failed:', error);
    document.getElementById('toggleBtn').textContent = 'Error';
    document.getElementById('status').textContent = error.message;
  }
}

// Run when popup opens
init();
