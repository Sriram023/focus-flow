// FocusFlow Extension Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusText = document.getElementById('statusText');

  // Load current status
  const response = await chrome.runtime.sendMessage({ action: 'getStatus' });

  updateUI(response.focusModeActive);

  // Toggle focus mode
  toggleBtn.addEventListener('click', async () => {
    const currentStatus = toggleBtn.classList.contains('active');
    const newStatus = !currentStatus;

    await chrome.runtime.sendMessage({
      action: 'toggleFocusMode',
      enabled: newStatus,
    });

    updateUI(newStatus);
  });

  function updateUI(isActive) {
    if (isActive) {
      toggleBtn.classList.add('active');
      toggleBtn.textContent = 'Disable Focus Mode';
      statusText.textContent = 'Focus Mode: ON 🔥';
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.textContent = 'Enable Focus Mode';
      statusText.textContent = 'Focus Mode: OFF';
    }
  }
});
