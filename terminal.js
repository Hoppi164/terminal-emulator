class TerminalEmulator extends HTMLElement {
  connectedCallback() {
    const history = [];
    let historyIndex = -1;

    this.style.width = "100%";
    this.style.height = "100%";
    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.style.justifyContent = "flex-start";
    this.style.alignItems = "flex-start";
    this.style.backgroundColor = "#000";
    this.style.color = "#fff";
    this.style.fontFamily = "monospace";
    this.style.fontSize = "16px";
    this.style.border = "none";
    this.style.boxSizing = "border-box";
    this.style.position = "relative";
    this.style.zIndex = "1";

    // Create a shadow root
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Create a container element (output)
    const container = document.createElement("div");
    container.setAttribute("id", "container");
    container.setAttribute("class", "container");
    container.setAttribute(
      "style",
      `
      width: calc(100% - 20px);
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      border: none;
      `
    );
    shadowRoot.appendChild(container);
    // Create a terminal element (text input)
    const terminalInputWrapper = document.createElement("div");
    terminalInputWrapper.setAttribute("class", "terminal-input-wrapper");
    terminalInputWrapper.setAttribute(
      "style",
      `
      display: flex;
      width: calc(100% - 20px);
      padding: 10px;
      align-items: center;
      justify-content: flex-start;
      `
    );

    const terminal = document.createElement("input");
    const prefix = document.createElement("span");
    prefix.textContent = "drew@Work-Dev-Laptop:~$ ";
    prefix.setAttribute(
      "style",
      `
      display: inline-block;
      white-space: nowrap;
      align-self: center;
      color: lime;
    `
    );

    // make prefix width the same as the prefix text

    terminal.setAttribute("type", "text");
    terminal.setAttribute("id", "terminal");
    terminal.setAttribute("class", "terminal");
    terminal.setAttribute("autofocus", "true");
    terminal.setAttribute("autocomplete", "off");
    terminal.setAttribute("spellcheck", "false");
    terminal.setAttribute("autocorrect", "off");
    terminal.setAttribute("autocapitalize", "off");
    terminal.setAttribute("tabindex", "0");
    terminal.setAttribute(
      "style",
      `
      width: 100%;
      padding: 10px;
      border: none;
      outline: none;
      background-color: #000;
      color: #fff;
      flex-grow: 1;
      `
    );
    terminalInputWrapper.appendChild(prefix);
    terminalInputWrapper.appendChild(terminal);
    shadowRoot.appendChild(terminalInputWrapper);

    // Focus the terminal
    terminal.focus();

    // Handle keydown events
    terminal.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = terminal.value;
        terminal.value = "";
        this.handleCommand(command);
      }
    });

    // Handle command
    this.handleCommand = (command) => {
      const commandLine = document.createElement("div");
      const outputLine = document.createElement("div");

      const commandPrefix = document.createElement("span");
      commandPrefix.textContent = "drew@Work-Dev-Laptop:~$ ";
      commandPrefix.setAttribute(
        "style",
        `
        display: inline-block;
        white-space: nowrap;
        align-self: center;
        color: lime;
        `
      );
      commandLine.appendChild(commandPrefix);

      const commandText = document.createElement("span");
      commandText.setAttribute(
        "style",
        `
        display: inline-block;
        white-space: nowrap;
        align-self: center;
        color: #fff;
        padding-left: 10px;
        `
      );
      commandText.textContent = command;
      commandLine.appendChild(commandText);
      container.appendChild(commandLine);

      const outputText = document.createElement("span");
      // outputText.textContent = this.executeCommand(command);
      outputText.textContent = `${command}: command not found`
      outputLine.appendChild(outputText);
      container.appendChild(outputLine);

      history.push({ command, output: outputText.textContent });
    };

    // onclick: focus the terminal
    this.addEventListener("click", () => {
      terminal.focus();
    });
    // but allow selection of text within the container
    container.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    terminal.addEventListener("keydown", (e) => {
      // Make the arrow keys select the previous/next command from the history
      if (e.key === "ArrowUp") {
        if (historyIndex === -1) {
          historyIndex = history.length;
        }
        if (historyIndex > 0) {
          historyIndex--;
        }
        terminal.value = history[historyIndex].command;
      } else if (e.key === "ArrowDown") {
        if (historyIndex < history.length - 1 && historyIndex !== -1) {
          historyIndex++;
          terminal.value = history[historyIndex].command;
        } else {
          historyIndex = -1;
          terminal.value = "";
        }
      }

      // Make the (ctrl + l) clear the terminal ( also works with (ctrl + shift + l) or (ctrl + alt + l) or (ctrl + shift + alt + l) )
      if ((e.ctrlKey && e.key === "l") || (e.ctrlKey && e.shiftKey && e.key === "L")) {
        // Prevent the default action if this is a hotkey for the web browser
        e.preventDefault();

        container.innerHTML = "";
      }
    });
  }
}

customElements.define("terminal-emulator", TerminalEmulator);
