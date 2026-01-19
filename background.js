// Background service worker for managing badge state

// Get the cookie value for a specific tab
async function getCookieForTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);

    if (!tab || !tab.url) {
      return null;
    }

    // Skip chrome:// and other special URLs
    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
      return null;
    }

    const cookie = await chrome.cookies.get({
      url: tab.url,
      name: 'waffles'
    });

    return cookie;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
}

// Update icon with green or red border based on cookie state
async function updateIconForTab(tabId) {
  try {
    const cookie = await getCookieForTab(tabId);
    const isEnabled = cookie && cookie.value === 'true';

    if (isEnabled) {
      // Green border when cookie is on
      await chrome.action.setIcon({
        path: {
          "16": "icon-green-16.png",
          "48": "icon-green-48.png",
          "128": "icon-green-128.png"
        },
        tabId: tabId
      });
    } else {
      // Red border when cookie is off
      await chrome.action.setIcon({
        path: {
          "16": "icon-red-16.png",
          "48": "icon-red-48.png",
          "128": "icon-red-128.png"
        },
        tabId: tabId
      });
    }
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateIconForTab(activeInfo.tabId);
});

// Listen for tab updates (page navigation, reload)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only update when the page is fully loaded or URL changes
  if (changeInfo.status === 'complete' || changeInfo.url) {
    await updateIconForTab(tabId);
  }
});

// Listen for cookie changes
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  // Only react to waffles cookie changes
  if (changeInfo.cookie.name === 'waffles') {
    // Get all tabs and update the badge for matching tabs
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url && tab.url.includes(changeInfo.cookie.domain)) {
        await updateIconForTab(tab.id);
      }
    }
  }
});

// Initialize badge when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  // Get the current active tab and update its badge
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    await updateIconForTab(activeTab.id);
  }
});

// Initialize badge when browser starts
chrome.runtime.onStartup.addListener(async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    await updateIconForTab(activeTab.id);
  }
});
