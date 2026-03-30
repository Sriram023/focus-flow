// Focus detection utilities for strict focus mode

class FocusDetector {
  constructor() {
    this.listeners = {
      tabSwitch: [],
      fullscreenExit: [],
      windowMinimize: [],
      notificationInteraction: [],
    };
    this.isMonitoring = false;
    this.fullscreenElement = null;
  }

  // Start monitoring focus
  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Detect tab switching / window blur
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);

    // Detect visibility change (tab switch, minimize)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Detect fullscreen exit
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);

    console.log('Focus monitoring started');
  }

  // Stop monitoring
  stopMonitoring() {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;

    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);

    console.log('Focus monitoring stopped');
  }

  // Enter fullscreen mode
  async enterFullscreen(element) {
    try {
      this.fullscreenElement = element || document.documentElement;

      if (this.fullscreenElement.requestFullscreen) {
        await this.fullscreenElement.requestFullscreen();
      } else if (this.fullscreenElement.webkitRequestFullscreen) {
        await this.fullscreenElement.webkitRequestFullscreen();
      } else if (this.fullscreenElement.mozRequestFullScreen) {
        await this.fullscreenElement.mozRequestFullScreen();
      } else if (this.fullscreenElement.msRequestFullscreen) {
        await this.fullscreenElement.msRequestFullscreen();
      }

      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  }

  // Exit fullscreen mode
  async exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      this.fullscreenElement = null;
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }

  // Check if in fullscreen
  isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  // Event handlers
  handleWindowBlur = () => {
    if (!this.isMonitoring) return;
    this.triggerListeners('tabSwitch', {
      type: 'window-blur',
      timestamp: new Date(),
    });
  };

  handleWindowFocus = () => {
    if (!this.isMonitoring) return;
    // Window regained focus
  };

  handleVisibilityChange = () => {
    if (!this.isMonitoring) return;

    if (document.hidden) {
      this.triggerListeners('tabSwitch', {
        type: 'tab-switch',
        timestamp: new Date(),
      });
    }
  };

  handleFullscreenChange = () => {
    if (!this.isMonitoring) return;

    if (!this.isFullscreen() && this.fullscreenElement !== null) {
      // User exited fullscreen
      this.triggerListeners('fullscreenExit', {
        type: 'fullscreen-exit',
        timestamp: new Date(),
      });
    }
  };

  // Listener management
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  triggerListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Check if notifications are supported
  notificationsSupported() {
    return 'Notification' in window;
  }
}

// Singleton instance
const focusDetector = new FocusDetector();

export default focusDetector;
