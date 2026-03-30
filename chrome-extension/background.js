// FocusFlow Chrome Extension - Background Service Worker

// Default blocked websites
const DEFAULT_BLOCKED_SITES = [
  'facebook.com',
  'instagram.com',
  'youtube.com',
  'twitter.com',
  'reddit.com',
  'tiktok.com',
  'netflix.com',
];

// Check if URL is blocked
function isBlocked(url, blockedSites) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');

    return blockedSites.some(site => {
      return hostname.includes(site) || hostname === site;
    });
  } catch (e) {
    return false;
  }
}

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only check main frame

  // Get focus mode status
  const result = await chrome.storage.local.get(['focusModeActive', 'blockedSites']);
  const focusModeActive = result.focusModeActive || false;
  const blockedSites = result.blockedSites || DEFAULT_BLOCKED_SITES;

  if (focusModeActive && isBlocked(details.url, blockedSites)) {
    // Redirect to block page
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL('blocked.html')
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFocusMode') {
    chrome.storage.local.set({ focusModeActive: request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'updateBlockedSites') {
    chrome.storage.local.set({ blockedSites: request.sites }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'getStatus') {
    chrome.storage.local.get(['focusModeActive', 'blockedSites'], (result) => {
      sendResponse({
        focusModeActive: result.focusModeActive || false,
        blockedSites: result.blockedSites || DEFAULT_BLOCKED_SITES,
      });
    });
    return true;
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    focusModeActive: false,
    blockedSites: DEFAULT_BLOCKED_SITES,
  });
});
