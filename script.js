class TerminalResume {
  constructor() {
    this.output = document.getElementById("output");
    this.input = document.getElementById("command-input");
    this.terminal = document.querySelector(".terminal");
    this.terminalContainer = document.querySelector(".terminal-container");
    this.contextMenu = document.querySelector(".context-menu");
    this.terminals = [{ input: this.input, history: [], historyIndex: -1 }];
    this.activeTerminal = 0;
    this.activeTerminalContent = null;
    this.resizing = null;

    // New properties for themes and game
    this.currentTheme = localStorage.getItem("theme") || "default";
    this.projects = [];
    this.skills = {};
    this.fileSystem = {};
    this.gameActive = false;
    this.gameHandler = null;

    // Initialize modals
    this.themeModal = document.getElementById("theme-modal");
    this.projectsModal = document.getElementById("projects-modal");
    this.skillsModal = document.getElementById("skills-modal");

    // Initialize theme selector
    this.themeToggle = document.getElementById("theme-toggle");

    this.setupEventListeners();
    this.loadProjects();
    this.loadSkills();
    this.setupFileSystem();
    this.init();
  }

  init() {
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
  }
  setupContextMenu() {
    // Handle right-click on terminal content
    this.terminalContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const terminalContent = e.target.closest(".terminal-content");
      if (terminalContent) {
        this.activeTerminalContent = terminalContent;
        this.showContextMenu(e.clientX, e.clientY);
      }
    });

    // Hide context menu on click outside
    document.addEventListener("click", () => {
      this.contextMenu.classList.remove("active");
    });

    // Handle menu item clicks
    this.contextMenu.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      if (action) {
        this.handleContextMenuAction(action);
      }
    });
  }

  showContextMenu(x, y) {
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.classList.add("active");

    // Show/hide close option based on whether this terminal can be closed
    const closeOption = this.contextMenu.querySelector(
      '[data-action="close-split"]'
    );
    const isMainTerminal =
      this.activeTerminalContent === this.terminalContainer.firstElementChild;
    closeOption.style.display = isMainTerminal ? "none" : "block";
  }

  handleContextMenuAction(action) {
    if (!this.activeTerminalContent) return;

    switch (action) {
      case "split-h":
        this.splitTerminal("horizontal", this.activeTerminalContent);
        break;
      case "split-v":
        this.splitTerminal("vertical", this.activeTerminalContent);
        break;
      case "close-split":
        this.closeSplit(this.activeTerminalContent);
        break;
    }
    this.contextMenu.classList.remove("active");
  }

  setupEventListeners() {
    // Window control buttons
    const closeBtn = document.querySelector(".terminal-buttons .close");
    const minimizeBtn = document.querySelector(".terminal-buttons .minimize");
    const maximizeBtn = document.querySelector(".terminal-buttons .maximize");

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
  }
  setupInputHandlers(inputElement) {
    inputElement.addEventListener("keydown", (e) => {
      const terminal = this.terminals.find((t) => t.input === inputElement);
      if (!terminal) return;

      if (e.key === "Enter") {
        this.handleCommand(inputElement);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateHistory("up", terminal);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateHistory("down", terminal);
      } else if (e.key === "l" && e.ctrlKey) {
        // Handle Ctrl+L (clear screen)
        e.preventDefault();
        const outputElement = inputElement
          .closest(".terminal-content")
          .querySelector("[id^='output']");
        outputElement.innerHTML = "";
        this.printWelcomeMessage(outputElement);
      } else if (e.key === "Tab") {
        // Handle Tab completion
        e.preventDefault();
        this.handleTabCompletion(inputElement);
      }
    });
  }

  handleTabCompletion(inputElement) {
    const currentInput = inputElement.value.toLowerCase().trim();
    const commands = [
      "help",
      "about",
      "skills",
      "experience",
      "education",
      "contact",
      "clear",
      "projects",
      "skills-visual",
      "game",
      "exit-game",
      "matrix",
      "stop-matrix",
            "calc",
      "calculate",
      "pdf",
    ];

    // Find matching commands
    const matches = commands.filter((cmd) => cmd.startsWith(currentInput));

    if (matches.length === 1) {
      // Single match - complete the command
      inputElement.value = matches[0];
    } else if (matches.length > 1 && currentInput) {
      // Multiple matches - show possibilities
      const outputElement = inputElement
        .closest(".terminal-content")
        .querySelector("[id^='output']");

      const matchesText = `\nPossible commands:\n${matches.join("  ")}`;
      this.printToOutput(outputElement, matchesText, "info");
    }
  }

  navigateHistory(direction, terminal) {
    if (
      direction === "up" &&
      terminal.historyIndex < terminal.history.length - 1
    ) {
      terminal.historyIndex++;
    } else if (direction === "down" && terminal.historyIndex > -1) {
      terminal.historyIndex--;
    }

    if (
      terminal.historyIndex >= 0 &&
      terminal.historyIndex < terminal.history.length
    ) {
      terminal.input.value =
        terminal.history[terminal.history.length - 1 - terminal.historyIndex];
    } else {
      terminal.input.value = "";
    }
  }

  splitTerminal(direction, sourceTerminal) {
    const parentContainer = sourceTerminal.parentElement;
    const isAlreadySplit = parentContainer.children.length > 1;
    const splitClass = direction === "horizontal" ? "split-h" : "split-v";

    // If parent is not split or split in different direction, create new container
    if (!isAlreadySplit || !parentContainer.classList.contains(splitClass)) {
      const newContainer = document.createElement("div");
      newContainer.className = `terminal-container ${splitClass}`;

      // Move source terminal to new container
      sourceTerminal.parentElement.insertBefore(newContainer, sourceTerminal);
      newContainer.appendChild(sourceTerminal);

      // Create new terminal in the container
      this.createNewTerminalContent(newContainer);
    } else {
      // Add new terminal to existing split container
      this.createNewTerminalContent(parentContainer);
    }
  }

  createNewTerminalContent(container) {
    const newContent = document.createElement("div");
    newContent.className = "terminal-content";
    const timestamp = Date.now();
    newContent.innerHTML = `
      <div id="output-${timestamp}" class="terminal-output"></div>
      <div class="input-line">
        <span class="prompt">➜</span>
        <input type="text" id="command-input-${timestamp}" class="command-input" />
      </div>
    `;

    // Add resize handle if not the last element
    if (container.children.length > 0) {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${
        container.classList.contains("split-h") ? "horizontal" : "vertical"
      }`;
      container.lastElementChild.appendChild(handle);
      this.setupResizeHandle(handle);
    }

    container.appendChild(newContent);

    // Setup new input
    const newInput = newContent.querySelector(".command-input");
    this.setupInputHandlers(newInput);

    // Add to terminals array
    this.terminals.push({
      input: newInput,
      history: [],
      historyIndex: -1,
    });

    // Print welcome message in new terminal
    const newOutput = newContent.querySelector(`#output-${timestamp}`);
    this.printWelcomeMessage(newOutput);

    // Focus new terminal
    newInput.focus();
    this.activeTerminal = this.terminals.length - 1;
  }

  setupResizeHandle(handle) {
    const isHorizontal = handle.classList.contains("horizontal");

    const startResize = (e) => {
      e.preventDefault();
      this.resizing = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        parentContainer: handle.closest(".terminal-container"),
        element: handle.parentElement,
        initialSize: isHorizontal
          ? handle.parentElement.offsetWidth
          : handle.parentElement.offsetHeight,
      };

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    };

    const resize = (e) => {
      if (!this.resizing) return;

      const { parentContainer, element, startX, startY, initialSize } =
        this.resizing;
      const containerRect = parentContainer.getBoundingClientRect();

      if (isHorizontal) {
        const deltaX = e.clientX - startX;
        const newWidth = initialSize + deltaX;
        const maxWidth = containerRect.width - 150; // Leave space for other splits

        if (newWidth >= 150 && newWidth <= maxWidth) {
          const percentage = (newWidth / containerRect.width) * 100;
          element.style.flex = "none";
          element.style.width = `${percentage}%`;
        }
      } else {
        const deltaY = e.clientY - startY;
        const newHeight = initialSize + deltaY;
        const maxHeight = containerRect.height - 100;

        if (newHeight >= 100 && newHeight <= maxHeight) {
          const percentage = (newHeight / containerRect.height) * 100;
          element.style.flex = "none";
          element.style.height = `${percentage}%`;
        }
      }
    };

    const stopResize = () => {
      this.resizing = null;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    handle.addEventListener("mousedown", startResize);
  }

  printToOutput(outputElement, text, className = "", useTypewriter = false) {
    if (!text) {
      outputElement.innerHTML = "";
      return Promise.resolve();
    }

    const line = document.createElement("div");
    line.className = className;

    // Ensure consistent text formatting
    line.style.whiteSpace = "pre-wrap";
    line.style.marginBottom = "0.5rem";

    outputElement.appendChild(line);

    // Force scroll to bottom
    this.scrollToBottom(outputElement.closest(".terminal-content"));

    if (useTypewriter && !text.includes("<")) {
      // For plain text, use typewriter effect
      return this.typeText(line, text, 20);
    } else if (useTypewriter && text.includes("<")) {
      // For HTML content, use HTML typewriter
      return this.typeHTML(line, text, 20);
    } else {
      // No typewriter effect
      line.innerHTML = text;
      return Promise.resolve();
    }
  }

  scrollToBottom(terminalContent) {
    if (!terminalContent) return;

    // Only scroll if content is actually overflowing
    if (terminalContent.scrollHeight > terminalContent.clientHeight) {
      const currentScrollTop = terminalContent.scrollTop;
      const maxScroll =
        terminalContent.scrollHeight - terminalContent.clientHeight;

      // If we're not already at the bottom, scroll
      if (currentScrollTop < maxScroll) {
        terminalContent.scrollTop = maxScroll;

        // Use requestAnimationFrame to ensure scroll happens after render
        requestAnimationFrame(() => {
          terminalContent.scrollTop = maxScroll;
        });
      }
    }
  }

  handleCommand(inputElement) {
    const terminal = this.terminals.find((t) => t.input === inputElement);
    if (!terminal) return;

    const command = inputElement.value.trim().toLowerCase();
    const outputElement = inputElement
      .closest(".terminal-content")
      .querySelector("[id^='output']");

    this.printToOutput(outputElement, `➜ ${command}`, "command");
    terminal.history.push(command);
    terminal.historyIndex = -1;
    inputElement.value = "";

    // Parse command and arguments
    const [cmd, ...args] = command.split(" ");

    // Execute command
    switch (cmd) {
      case "help":
        this.showHelp(outputElement);
        break;
      case "about":
        this.showAbout(outputElement);
        break;
      case "experience":
        this.showExperience(outputElement);
        break;
      case "education":
        this.showEducation(outputElement);
        break;
      case "skills":
        this.showSkills(outputElement);
        break;
      case "contact":
        this.showContact(outputElement);
        break;
      case "clear":
        outputElement.innerHTML = "";
        this.printWelcomeMessage(outputElement);
        break;
      case "projects":
        this.showProjects();
        break;
      case "skills-visual":
        this.showSkillsVisualization();
        break;
      case "game":
        this.initGame();
        break;
      case "pdf":
        this.generatePDF();
        break;
            case "exit-game":
        this.endGame();
        this.printToOutput(outputElement, "Game exited.", "info");
        break;
      case "matrix":
        this.startMatrixEffect(outputElement);
        break;
      case "stop-matrix":
        this.stopMatrixEffect();
        this.printToOutput(outputElement, "Matrix effect stopped.", "info");
        break;
      case "calc":
      case "calculate":
        this.calculate(args.join(" "), outputElement);
        break;
      case "":
        break;
      default:
        this.printToOutput(
          outputElement,
          `Command not found: ${command}. Type 'help' for available commands.`,
          "error"
        );
    }

    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  printWelcomeMessage(outputElement = this.output) {
    const asciiArt = `██████████████████████╗
╚════██╔════════██╔═══╝
     ██║        ██║
     ██║        ██║
     ██║        ██║
     ██║        ╚█████╗
     ╚═╝         ╚════╝`;

    const divider = "─────────────────────────────────────────────────";

    // Build the string carefully to avoid ANY leading spaces getting rendered
    // because the terminal uses white-space: pre-wrap;
    let welcome = `<div style="display: flex; flex-direction: column; align-items: center; width: 100%;">`;
    
    // Pi symbol block
    welcome += `<div style="text-align: left; margin-bottom: 5px;">`;
    welcome += this.wrapWithColor(asciiArt, "#d4843e");
    welcome += `</div>`;

    // Text block
    welcome += `<div style="text-align: center;">`;
    welcome += this.wrapWithColor(divider, "#555555") + `<br>`;
    welcome += this.wrapWithColor("Interactive Terminal Resume", "#888888") + `<br>`;
    welcome += this.wrapWithColor("Backend Developer • B.Tech Student • Open Source", "#666666") + `<br>`;
    welcome += this.wrapWithColor(divider, "#555555") + `<br><br>`;
    welcome += this.wrapWithColor("Type ", "#666666") + this.wrapWithColor("'help'", "#87af87") + this.wrapWithColor(" to see available commands", "#666666") + `<br>`;
    welcome += this.wrapWithColor("Press ", "#666666") + this.wrapWithColor("'tab'", "#87af87") + this.wrapWithColor(" to auto-complete commands", "#666666");
    welcome += `</div>`;
    welcome += `</div>`;

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = welcome;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showHelp(outputElement = this.output) {
    const title = this.wrapWithColor("Available Commands\n\n", "#ffff00");

    const mainCommands =
      this.wrapWithColor("Main Commands:\n", "#00ffff") +
      this.wrapWithColor("• help", "#98fb98") +
      "       " +
      this.wrapWithColor("Show this help message\n", "#ffffff") +
      this.wrapWithColor("• about", "#98fb98") +
      "      " +
      this.wrapWithColor("Display my professional summary\n", "#ffffff") +
      this.wrapWithColor("• skills", "#98fb98") +
      "     " +
      this.wrapWithColor("View my technical expertise\n", "#ffffff") +
      this.wrapWithColor("• experience", "#98fb98") +
      " " +
      this.wrapWithColor("Show my work history\n", "#ffffff") +
      this.wrapWithColor("• education", "#98fb98") +
      "  " +
      this.wrapWithColor("View my educational background\n", "#ffffff") +
      this.wrapWithColor("• contact", "#98fb98") +
      "    " +
      this.wrapWithColor("Get my contact information\n", "#ffffff") +
      this.wrapWithColor("• clear", "#98fb98") +
      "      " +
      this.wrapWithColor("Clear the terminal screen\n", "#ffffff");

    const utilityCommands =
      "\n" +
      this.wrapWithColor("Utility Commands:\n", "#00ffff") +
      this.wrapWithColor("• projects", "#98fb98") +
      "   " +
      this.wrapWithColor("View my project showcase\n", "#ffffff") +
      this.wrapWithColor("• skills-visual", "#98fb98") +
      " " +
      this.wrapWithColor("Show skills visualization\n", "#ffffff") +
      this.wrapWithColor("• game", "#98fb98") +
      "      " +
      this.wrapWithColor("Play a mini-game\n", "#ffffff") +
      this.wrapWithColor("• matrix", "#98fb98") +
      "    " +
      this.wrapWithColor("Start Matrix digital rain effect\n", "#ffffff") +
      this.wrapWithColor("• calc", "#98fb98") +
      "      " +
      this.wrapWithColor("Calculate mathematical expressions\n", "#ffffff") +
      this.wrapWithColor("• pdf", "#98fb98") +
      "       " +
      this.wrapWithColor("Download resume as PDF\n", "#ffffff");


    const shortcuts =
      "\n" +
      this.wrapWithColor("Shortcuts:\n", "#666666") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("↑/↓", "#666666") +
      "         " +
      this.wrapWithColor("Navigate command history\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Tab", "#666666") +
      "         " +
      this.wrapWithColor("Auto-complete commands\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+L", "#666666") +
      "      " +
      this.wrapWithColor("Clear the screen\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+Shift+H", "#666666") +
      " " +
      this.wrapWithColor("Split horizontally\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+Shift+V", "#666666") +
      " " +
      this.wrapWithColor("Split vertically", "#444444");

    const help = title + mainCommands + utilityCommands + shortcuts;

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = help;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showAbout(outputElement = this.output) {
    const about = `<span style="color: #ff8c00; font-weight: bold;">About Me</span>

${this.wrapWithColor(
  "┌─────────────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Hi! I'm Kartik Chawla, B.Tech. Student at IIT Patna.",
      "#ffffff"
    )}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Passionate about Web Development and Language Design.",
      "#ffffff"
    )}
${this.wrapWithColor(
  "└─────────────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("Experience", "#ff8c00")}
${this.wrapWithColor(
  "   Web Development Sub-Coordinator for major IIT Patna fests",
  "#ffffff"
)}
${this.wrapWithColor("   (Anwesha, TedX, Celesta) & NJACK DevOS club.", "#ff8c00")}

${this.wrapWithColor("Passion", "#ff8c00")}
${this.wrapWithColor(
  "   Building dynamically-typed languages like ToadCode and",
  "#ffffff"
)}
${this.wrapWithColor(
  "   solving complex algorithmic problems (1700+ LeetCode rating).",
  "#ffffff"
)}

${this.wrapWithColor("Strengths", "#ff8c00")}
${this.wrapWithColor(
  "   MERN Stack, C/C++, TypeScript, and competitive",
  "#ffffff"
)}
${this.wrapWithColor("   programming. Also a State Level Chess Champion!", "#ffffff")}

${this.wrapWithColor(
  "╭───────────────────────────────────────────────────────╮",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Ready to bring your innovative ideas to life!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "╰───────────────────────────────────────────────────────╯",
  "#ff8c00"
)}`;

    const aboutDiv = document.createElement("div");
    aboutDiv.innerHTML = about;
    outputElement.appendChild(aboutDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  // Helper method to wrap text with color
  wrapWithColor(text, color) {
    return `<span style="color: ${color}">${text}</span>`;
  }

  // Typewriter effect for terminal outputs
  typeText(element, text, speed = 30) {
    if (!element || !text) return Promise.resolve();

    return new Promise((resolve) => {
      let index = 0;
      element.textContent = "";
      element.style.display = "inline-block";

      const interval = setInterval(() => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  // Apply typewriter effect to HTML content
  async typeHTML(element, html, speed = 30) {
    if (!element || !html) return Promise.resolve();

    // Create a temporary div to hold the HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Get text nodes and elements in order
    const walker = document.createTreeWalker(
      temp,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    const nodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      nodes.push(currentNode);
    }

    // Clear the target element
    element.innerHTML = "";

    // Process each node
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement("span");
        element.appendChild(span);
        await this.typeText(span, node.textContent, speed);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        element.appendChild(clone);

        // If this is a style or has no children, just add it as is
        if (node.tagName === "STYLE" || !node.hasChildNodes()) {
          clone.innerHTML = node.innerHTML;
        }
      }
    }

    return Promise.resolve();
  }

  showExperience(outputElement = this.output) {
    const experience = `<span style="color: #ffff00; font-weight: bold;">Professional Experience</span>

<span style="color: #00ffff;">GirlScript Summer Of Code | Contributor</span>
${this.wrapWithColor(
  "May 2026 - Present | Remote",
  "#ffffff"
)}
${this.wrapWithColor(
  "Open Source Contributions",
  "#98fb98"
)}

• ${this.wrapWithColor("Full-Stack Contributor", "#ffa07a")} - ${this.wrapWithColor(
      "Contributed to multiple projects using modern web technologies.",
      "#ffffff"
    )}

<span style="color: #00ffff;">NJACK / Anwesha | Sub-Coordinator / Web Developer</span>
${this.wrapWithColor(
  "Apr 2026 - Present | IIT Patna",
  "#ffffff"
)}
${this.wrapWithColor(
  "Tech & Web Development",
  "#98fb98"
)}

• ${this.wrapWithColor("Web Developer", "#ffa07a")} - ${this.wrapWithColor(
      "Developed web portals and managed tech operations for the college fest.",
      "#ffffff"
    )}`;

    this.printToOutput(outputElement, experience);
  }

  showEducation(outputElement = this.output) {
    const education = `<span style="color: #ff8c00; font-weight: bold;">Education</span>

${this.wrapWithColor(
  "┌──────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")}${this.wrapWithColor(
      " B.Tech in Chemical Science and Technology    ",
      "#ffffff"
    )}${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "└──────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("Institution:", "#ff8c00")} ${this.wrapWithColor(
      "Indian Institute of Technology (IIT) Patna",
      "#ffffff"
    )}
${this.wrapWithColor("Duration:", "#ff8c00")}    ${this.wrapWithColor(
      "2025 - 2029",
      "#ffffff"
    )}
${this.wrapWithColor("Location:", "#ff8c00")}    ${this.wrapWithColor(
      "Patna, Bihar",
      "#ffffff"
    )}`;

    this.printToOutput(outputElement, education);
  }

  showSkills(outputElement = this.output) {
    const skills = `<span style="color: #ffff00; font-weight: bold;">SKILLS</span>

• ${this.wrapWithColor("Go (Golang)", "#ffffff")}
• ${this.wrapWithColor("C/C++", "#ffffff")}
• ${this.wrapWithColor("Node.js", "#ffffff")}
• ${this.wrapWithColor("React", "#ffffff")}
• ${this.wrapWithColor("Express", "#ffffff")}
• ${this.wrapWithColor("MongoDB / SQL", "#ffffff")}
• ${this.wrapWithColor("Supabase", "#ffffff")}
• ${this.wrapWithColor("Docker / GitHub Actions", "#ffffff")}
• ${this.wrapWithColor("JWT / OAuth", "#ffffff")}
• ${this.wrapWithColor("Electron / Raylib", "#ffffff")}

Type ${this.wrapWithColor(
      "skills-visual",
      "#00e5ff"
    )} for an interactive skills chart!`;

    this.printToOutput(outputElement, skills);
  }

  showContact(outputElement = this.output) {
    const contact = `<span style="color: #ff8c00; font-weight: bold;">Contact Information</span>

${this.wrapWithColor("┌───────────────────────────────────────────┐", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Let's connect and create something great!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("└───────────────────────────────────────────┘", "#ff8c00")}

${this.wrapWithColor(
      "Email:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="mailto:iamkartik0704@gmail.com" style="color: #ffffff; text-decoration: none;">iamkartik0704@gmail.com</a>',
      "#ffffff"
    )}

${this.wrapWithColor(
      "Github:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://github.com/iamkartik0704" target="_blank" style="color: #ffffff; text-decoration: none;">github.com/iamkartik0704</a>',
      "#ffffff"
    )}

${this.wrapWithColor(
      "LinkedIn:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://linkedin.com/in/kartik-chawla-189430203" target="_blank" style="color: #ffffff; text-decoration: none;">linkedin.com/in/kartik-chawla-189430203</a>',
      "#ffffff"
    )}

${this.wrapWithColor("╭───────────────────────────────────────────╮", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Feel free to reach out for opportunities!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("╰───────────────────────────────────────────╯", "#ff8c00")}`;

    const contactDiv = document.createElement("div");
    contactDiv.innerHTML = contact;
    outputElement.appendChild(contactDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  closeSplit(terminalContent) {
    const container = terminalContent.parentElement;
    const input = terminalContent.querySelector("input");

    // Remove from terminals array
    const terminalIndex = this.terminals.findIndex((t) => t.input === input);
    if (terminalIndex > -1) {
      this.terminals.splice(terminalIndex, 1);
    }

    // Remove the terminal content
    terminalContent.remove();

    // If container is empty or has only one child, move remaining content up
    if (
      container.children.length <= 1 &&
      container !== this.terminalContainer
    ) {
      if (container.children.length === 1) {
        const remainingContent = container.firstElementChild;
        container.parentElement.insertBefore(remainingContent, container);
      }
      container.remove();
    }

    // Focus the previous terminal
    if (this.terminals.length > 0) {
      const newActiveIndex = Math.min(terminalIndex, this.terminals.length - 1);
      this.terminals[newActiveIndex].input.focus();
      this.activeTerminal = newActiveIndex;
    }
  }

  loadProjects() {
    this.projects = [
      {
        title: "ToadCode",
        description: "Dynamically-typed scripting language with hand-written lexer/parser/interpreter. TypeScript.",
        image: "terminal_images/toadcode.jpg",
        technologies: ["TypeScript"],
        demo: "https://marketplace.visualstudio.com/items?itemName=KARTIKCHAWLA.toadcode-pro",
        repo: "https://github.com/iamkartik0704/customlang"
      },
      {
        title: "Compile",
        description: "AI-native desktop IDE with multi-LLM support and real-time environment compilation. Electron, React.",
        image: "terminal_images/compile.jpg",
        technologies: ["Electron", "React", "AI"],
        demo: "https://www.kartikchawla.in/",
        repo: "https://github.com/iamkartik0704/compile"
      },
      {
        title: "RankMatrix",
        description: "Data-driven MERN application providing predictive college insights for JEE aspirants.",
        image: "terminal_images/rankmatrix.jpg",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "https://rankmatrix.onrender.com/",
        repo: "https://github.com/iamkartik0704/rankmatrix"
      },
      {
        title: "ZappFoods",
        description: "Comprehensive backend for a food delivery platform. MERN stack.",
        image: "terminal_images/zappfood.png",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "https://zappfood.vercel.app/",
        repo: "https://github.com/iamkartik0704/Zappfood"
      }
    ];
  }

  loadSkills() {
    this.skills = {
      languages: {
        "Go (Golang)": 90,
        "C/C++": 85,
        "JavaScript": 85,
        "TypeScript": 80
      },
      backend: {
        "Node.js": 85,
        "Express": 85,
        "MongoDB": 90,
        "SQL": 80,
        "Supabase": 85
      },
      tools: {
        "Docker": 80,
        "Git/GitHub Actions": 85,
        "Electron/Raylib": 75,
        "JWT/OAuth": 80
      }
    };
  }

  setupFileSystem() {
    this.fileSystem = {
      resume: {
        type: "directory",
        contents: {
          "about.txt": { type: "file", content: "About me..." },
          "skills.md": { type: "file", content: "# Skills..." },
          projects: {
            type: "directory",
            contents: {
              "project1.md": { type: "file", content: "Project 1 details..." },
            },
          },
        },
      },
    };
  }

  // Theme handling
  handleThemeChange(theme) {
    this.terminal.className = `terminal theme-${theme}`;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.closeModal(this.themeModal);
  }

  // Modal handling
  showModal(modal) {
    modal.classList.add("active");
  }

  closeModal(modal) {
    modal.classList.remove("active");
  }

  // Projects showcase
  showProjects() {
    const container = this.projectsModal.querySelector(".projects-container");
    container.innerHTML = this.projects
      .map(
        (project) => `
      <div class="project-card">
        <img src="${project.image}" alt="${
          project.title
        }" class="project-image">
        <div class="project-details">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${project.technologies
              .map(
                (tech) => `
              <span class="tech-tag">${tech}</span>
            `
              )
              .join("")}
          </div>
          <div class="project-links">
            <a href="${project.demo}" class="project-link" target="_blank">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>
            <a href="${project.repo}" class="project-link" target="_blank">
              <i class="fab fa-github"></i> Repository
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
    this.showModal(this.projectsModal);
  }

  // Skills visualization
  showSkillsVisualization() {
    const container = this.skillsModal.querySelector(".skills-container");
    container.innerHTML = Object.entries(this.skills)
      .map(
        ([category, skills]) => `
      <div class="skill-category">
        <h3 class="skill-category-title">${category}</h3>
        <div class="skill-bars">
          ${Object.entries(skills)
            .map(
              ([skill, level]) => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${skill}</span>
                
              </div>
              <div class="skill-progress">
                <div class="skill-progress-bar" style="width: ${level}%"></div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
    this.showModal(this.skillsModal);
  }

  // File explorer
  navigateFileSystem(path) {
    const parts = path.split("/").filter(Boolean);
    let current = this.fileSystem;
    for (const part of parts) {
      if (current.type !== "directory" || !current.contents[part]) {
        return null;
      }
      current = current.contents[part];
    }
    return current;
  }

  // PDF Generation
  async generatePDF() {
    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");
    this.printToOutput(outputElement, "Opening resume...", "info");
    setTimeout(() => {
      window.open("resume.pdf", "_blank");
      this.printToOutput(
        outputElement,
        "Resume opened in a new tab!",
        "success"
      );
    }, 500);
  }

  // Mini-game - Snake game with p5.js
  initGame() {
    // Clean up any existing game
    this.endGame();

    // Start new game
    this.gameActive = true;

    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");

    const gameContainer = document.createElement("div");
    gameContainer.className = "game-container";
    gameContainer.id = "snake-game-container";
    gameContainer.innerHTML = `
      <div class="game-instructions">
        <p>Snake Game: Use arrow keys to move.</p>
        <p>Press P to pause, SPACE to restart, ESC to exit.</p>
      </div>
      <div id="snake-game-score">Score: 0</div>
      <div id="snake-game-canvas"></div>
    `;

    outputElement.appendChild(gameContainer);

    // Initialize p5.js snake game
    this.initSnakeGame();

    // Scroll to make sure game is visible
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  endGame() {
    if (!this.gameActive) return;

    this.gameActive = false;

    // Remove event listener if it exists
    if (this.gameHandler) {
      document.removeEventListener("keydown", this.gameHandler);
      this.gameHandler = null;
    }

    // Remove p5.js instance if it exists
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }

    // Remove game container if it exists
    const gameContainer = document.getElementById("snake-game-container");
    if (gameContainer) {
      gameContainer.remove();
    }
  }

  initSnakeGame() {
    const sketch = (p) => {
      // Game variables
      const gridSize = 20;
      const canvasWidth = 400;
      const canvasHeight = 300;
      let snake = [];
      let food;
      let direction = { x: 1, y: 0 };
      let nextDirection = { x: 1, y: 0 };
      let score = 0;
      let gameOver = false;
      let frameRate = 10;
      let isPaused = false;

      p.setup = () => {
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("snake-game-canvas");
        p.frameRate(frameRate);
        resetGame();
      };

      p.draw = () => {
        p.background(0);

        if (isPaused) {
          drawGrid();
          p.fill(255);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("PAUSED", canvasWidth / 2, canvasHeight / 2);
          p.textSize(16);
          p.text("Press P to resume", canvasWidth / 2, canvasHeight / 2 + 30);
          return;
        }

        if (gameOver) {
          drawGrid();
          p.fill(255, 0, 0);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Game Over!", canvasWidth / 2, canvasHeight / 2 - 20);
          p.textSize(16);
          p.text(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 20);
          p.text(
            "Press SPACE to restart",
            canvasWidth / 2,
            canvasHeight / 2 + 50
          );
          return;
        }

        // Update game state
        direction = nextDirection;
        moveSnake();
        checkCollision();
        checkFood();

        // Draw game
        drawGrid();
        drawSnake();
        drawFood();
        updateScore();
      };

      p.keyPressed = () => {
        if (p.keyCode === 80) {
          // P key for pause
          isPaused = !isPaused;
          return false;
        }

        if (isPaused) return false;

        if (p.keyCode === p.UP_ARROW && direction.y !== 1) {
          nextDirection = { x: 0, y: -1 };
        } else if (p.keyCode === p.DOWN_ARROW && direction.y !== -1) {
          nextDirection = { x: 0, y: 1 };
        } else if (p.keyCode === p.LEFT_ARROW && direction.x !== 1) {
          nextDirection = { x: -1, y: 0 };
        } else if (p.keyCode === p.RIGHT_ARROW && direction.x !== -1) {
          nextDirection = { x: 1, y: 0 };
        } else if (p.keyCode === 32 && gameOver) {
          // SPACE to restart
          resetGame();
        } else if (p.keyCode === 27) {
          // ESC to exit
          this.endGame();
        }

        // Prevent default behavior for arrow keys
        if (
          [
            p.UP_ARROW,
            p.DOWN_ARROW,
            p.LEFT_ARROW,
            p.RIGHT_ARROW,
            32,
            27,
            80,
          ].includes(p.keyCode)
        ) {
          return false;
        }
      };

      function resetGame() {
        snake = [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 3, y: 5 },
        ];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        placeFood();
        updateScore();
      }

      function moveSnake() {
        // Create new head
        const head = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y,
        };

        // Wrap around edges
        if (head.x < 0) head.x = Math.floor(canvasWidth / gridSize) - 1;
        if (head.x >= canvasWidth / gridSize) head.x = 0;
        if (head.y < 0) head.y = Math.floor(canvasHeight / gridSize) - 1;
        if (head.y >= canvasHeight / gridSize) head.y = 0;

        // Add new head to beginning of snake
        snake.unshift(head);

        // Remove tail unless food was eaten
        if (head.x !== food.x || head.y !== food.y) {
          snake.pop();
        } else {
          placeFood();
          score += 10;
          // Increase speed slightly with each food
          if (frameRate < 20) {
            frameRate += 0.5;
            p.frameRate(frameRate);
          }
        }
      }

      function checkCollision() {
        // Check if snake collides with itself
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
          if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
          }
        }
      }

      function checkFood() {
        const head = snake[0];
        if (head.x === food.x && head.y === food.y) {
          placeFood();
          score += 10;
        }
      }

      function placeFood() {
        // Find a position for food that's not occupied by the snake
        let validPosition = false;
        while (!validPosition) {
          food = {
            x: Math.floor(p.random(canvasWidth / gridSize)),
            y: Math.floor(p.random(canvasHeight / gridSize)),
          };

          validPosition = true;
          // Check if food is on snake
          for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
              validPosition = false;
              break;
            }
          }
        }
      }

      function drawSnake() {
        p.noStroke();

        // Draw snake body
        for (let i = 1; i < snake.length; i++) {
          p.fill(0, 255, 0); // Green body
          p.rect(
            snake[i].x * gridSize,
            snake[i].y * gridSize,
            gridSize - 2,
            gridSize - 2,
            4
          );
        }

        // Draw snake head
        p.fill(0, 200, 0); // Darker green head
        p.rect(
          snake[0].x * gridSize,
          snake[0].y * gridSize,
          gridSize - 2,
          gridSize - 2,
          6
        );
      }

      function drawFood() {
        p.fill(255, 0, 0); // Red food
        p.ellipse(
          food.x * gridSize + gridSize / 2,
          food.y * gridSize + gridSize / 2,
          gridSize * 0.8,
          gridSize * 0.8
        );
      }

      function drawGrid() {
        p.stroke(30);
        p.strokeWeight(0.5);

        // Draw vertical lines
        for (let x = 0; x <= canvasWidth; x += gridSize) {
          p.line(x, 0, x, canvasHeight);
        }

        // Draw horizontal lines
        for (let y = 0; y <= canvasHeight; y += gridSize) {
          p.line(0, y, canvasWidth, y);
        }
      }

      function updateScore() {
        const scoreElement = document.getElementById("snake-game-score");
        if (scoreElement) {
          scoreElement.textContent = `Score: ${score}`;
        }
      }
    };

    // Create new p5 instance
    this.p5Instance = new p5(sketch);
  }

  // Matrix rain effect
  startMatrixEffect(outputElement) {
    // Stop any existing matrix effect
    this.stopMatrixEffect();

    // Create canvas for matrix effect
    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix-container";
    matrixContainer.id = "matrix-container";

    const canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    matrixContainer.appendChild(canvas);

    const instructions = document.createElement("div");
    instructions.className = "matrix-instructions";
    instructions.textContent = "Type 'stop-matrix' to exit";
    matrixContainer.appendChild(instructions);

    outputElement.appendChild(matrixContainer);

    // Set up canvas
    const ctx = canvas.getContext("2d");
    canvas.width = matrixContainer.offsetWidth;
    canvas.height = 300;

    // Matrix characters
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const columns = Math.floor(canvas.width / 20);
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20);
    }

    // Matrix green color in current theme
    const getMatrixColor = () => {
      const themeColors = {
        default: "#00ff00",
        dracula: "#50fa7b",
        solarized: "#859900",
        nord: "#a3be8c",
      };
      return themeColors[this.currentTheme] || "#00ff00";
    };

    // Draw matrix effect
    const drawMatrix = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = getMatrixColor();
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters[Math.floor(Math.random() * characters.length)];

        // Draw character
        ctx.fillText(char, i * 20, drops[i] * 20);

        // Move drop down
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Start animation
    this.matrixInterval = setInterval(drawMatrix, 50);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  stopMatrixEffect() {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
      this.matrixInterval = null;
    }

    const matrixContainer = document.getElementById("matrix-container");
    if (matrixContainer) {
      matrixContainer.remove();
    }
  }

  // Weather command
  async 

  // Calculator command
  calculate(expression, outputElement) {
    if (!expression) {
      this.printToOutput(
        outputElement,
        "Please enter a mathematical expression. Usage: calc [expression]",
        "error"
      );
      return;
    }

    try {
      // Sanitize the expression to prevent code injection
      // Only allow numbers, basic operators, parentheses, and some math functions
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().%\s]/g, "");

      // Evaluate the expression
      const result = eval(sanitizedExpression);

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }

      // Format the result
      const formattedResult =
        typeof result === "number" && !Number.isInteger(result)
          ? result.toFixed(4).replace(/\.?0+$/, "")
          : result.toString();

      const calculationHTML = `<div class="calculation"><div class="calculation-expression">${this.wrapWithColor(expression, "#87cefa")}</div><div class="calculation-result">${this.wrapWithColor("= " + formattedResult, "#98fb98")}</div></div>`;

      this.printToOutput(outputElement, calculationHTML, "");
    } catch (error) {
      this.printToOutput(
        outputElement,
        `Error: Could not evaluate the expression. Make sure it's a valid mathematical expression.`,
        "error"
      );
    }
  }

  // LinkedIn Cover Generator
  
}

// Initialize the terminal
new TerminalResume();
