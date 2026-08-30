// Core visual state management for JARVIS UI
// Handles state transitions and visual feedback

class CoreState {
  constructor() {
    this.currentState = 'idle';
    this.coreElement = document.querySelector('.arc-core');
    this.consoleElement = document.getElementById('console');
    this.stateClasses = ['idle', 'listening', 'processing', 'active'];
    
    this.init();
  }

  init() {
    if (this.coreElement) {
      this.coreElement.classList.add('state-idle');
    }
    
    // Listen for state changes
    document.addEventListener('voiceStateChange', (e) => {
      this.handleStateChange(e.detail.state);
    });
  }

  handleStateChange(newState) {
    // Remove old state classes
    this.stateClasses.forEach(state => {
      if (this.coreElement) {
        this.coreElement.classList.remove(`state-${state}`);
      }
      document.body.classList.remove(`voice-${state}`);
    });

    // Add new state class
    this.currentState = newState;
    
    if (this.coreElement) {
      this.coreElement.classList.add(`state-${newState}`);
    }
    document.body.classList.add(`voice-${newState}`);

    // Update console based on state
    this.updateConsoleForState(newState);
  }

  updateConsoleForState(state) {
    const messages = {
      'idle': '> JARVIS ONLINE',
      'listening': '> Listening...',
      'processing': '> Processing request',
      'active': '> System active'
    };

    if (this.consoleElement) {
      this.consoleElement.innerHTML = `<span>${messages[state] || messages.idle}</span>`;
    }
  }

  // Public methods for state control
  setState(state) {
    const event = new CustomEvent('voiceStateChange', {
      detail: { state }
    });
    document.dispatchEvent(event);
  }

  getIdle() {
    return this.currentState === 'idle';
  }

  getListening() {
    return this.currentState === 'listening';
  }

  getProcessing() {
    return this.currentState === 'processing';
  }
}

// Initialize core state manager
const coreState = new CoreState();

// Expose globally for other modules
window.coreState = coreState;