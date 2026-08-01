import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update setupEventListeners to add window button handlers
idx_setup = content.find('setupEventListeners() {')
if idx_setup != -1:
    end_setup = content.find('  }\n\n', idx_setup)
    
    new_setup = """setupEventListeners() {
    // Window control buttons
    const closeBtn = document.querySelector(".terminal-button.close");
    const minimizeBtn = document.querySelector(".terminal-button.minimize");
    const maximizeBtn = document.querySelector(".terminal-button.maximize");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        sessionStorage.removeItem("terminalState");
        window.location.href = "index.html";
      });
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        this.saveState();
        window.location.href = "index.html";
      });
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.warn("Could not request fullscreen", err);
          });
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Global click handler for terminal focus
    this.terminalContainer.addEventListener("click", (e) => {
      const terminalContent = e.target.closest(".terminal-content");
      if (terminalContent) {
        const input = terminalContent.querySelector("input");
        if (input) {
          input.focus();
          this.activeTerminal = this.terminals.findIndex(
            (t) => t.input === input
          );
        }
      }
    });

    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl + Shift + H for horizontal split
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        const activeContent =
          this.terminals[this.activeTerminal].input.closest(
            ".terminal-content"
          );
        if (activeContent) {
          this.splitTerminal("horizontal", activeContent);
        }
      }
      // Ctrl + Shift + V for vertical split
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        const activeContent =
          this.terminals[this.activeTerminal].input.closest(
            ".terminal-content"
          );
        if (activeContent) {
          this.splitTerminal("vertical", activeContent);
        }
      }
    });

    // Setup initial input handlers
    this.setupInputHandlers(this.input);
  }"""
    content = content[:idx_setup] + new_setup + content[end_setup+4:]

# 2. Update init() to check sessionStorage
idx_init = content.find('init() {')
if idx_init != -1:
    end_init = content.find('  }\n\n', idx_init)
    
    new_init = """init() {
    // Apply saved theme
    this.handleThemeChange(this.currentTheme);

    // Set up modal close buttons
    document.querySelectorAll(".close-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.closeModal(button.closest(".modal"));
      });
    });

    // Theme toggle
    this.themeToggle.addEventListener("click", () => {
      this.showModal(this.themeModal);
    });

    // Hide language toggle since we're removing that feature
    const languageToggle = document.getElementById("language-toggle");
    if (languageToggle && languageToggle.parentElement) {
      languageToggle.parentElement.style.display = "none";
    }

    // Theme selection
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.handleThemeChange(option.dataset.theme);
      });
    });

    if (!this.loadState()) {
      this.printWelcomeMessage();
    }
    
    this.input.focus();
    this.setupContextMenu();
  }

  saveState() {
    const state = {
      history: this.terminals[0].history,
      outputHTML: this.output.innerHTML
    };
    sessionStorage.setItem("terminalState", JSON.stringify(state));
  }

  loadState() {
    const stateJson = sessionStorage.getItem("terminalState");
    if (stateJson) {
      try {
        const state = JSON.parse(stateJson);
        this.terminals[0].history = state.history || [];
        this.terminals[0].historyIndex = this.terminals[0].history.length;
        if (state.outputHTML) {
          this.output.innerHTML = state.outputHTML;
        }
        this.scrollToBottom();
        return true;
      } catch (e) {
        console.error("Failed to parse terminal state", e);
      }
    }
    return false;
  }"""
    content = content[:idx_init] + new_init + content[end_init+4:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Terminal state logic injected successfully!")
