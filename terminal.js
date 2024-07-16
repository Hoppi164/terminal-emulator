fetch("terminal.html")
  .then((stream) => stream.text())
  .then((text) => define(text));

import { getDefaultFileSystem } from "./utils/getDefaultFileSystem.js";
import { getDefaultUserData } from "./utils/getDefaultUserData.js";
import { ls, pwd, cd, whoami } from "./commands/index.js";
const commandMap = {
  // help:
  // connect: connect,
  // disconnect: disconnect,
  // login: login,
  // logout: logout,
  cd: async (userData, fileSystem, command) => cd(userData, fileSystem, command),
  ls: async (userData, fileSystem) => ls(userData, fileSystem),
  pwd: async (userData, fileSystem) => pwd(userData, fileSystem),
  // clear: () => '',
  // cat: cat,
  // rm: rm,
  // mv: mv,
  // cp: cp,
  // touch: touch,
  // mkdir: mkdir,
  // rmdir: rmdir,
  whoami: async (userData) => whoami(userData),
  // scan: () => 'Scanning...',
  // hack: () => 'Hacking...',
  // 'scan-network': () => 'Scanning...',
  // getAllServers: getAllServers,
  // getRandomServerIP: getRandomServerIP,
  // getRandomServer: getRandomServer,
  // getUserData: getUserData
};

async function define(html) {
  class TerminalEmulator extends HTMLElement {
    fileSystem = {};
    userData = {};
    history = [];
    historyIndex = -1;

    set value(fileSystem) {
      this.fileSystem = fileSystem;
    }

    get value() {
      return this.fileSystem;
    }

    constructor() {
      super();

      this.fileSystem = getDefaultFileSystem();
      this.userData = getDefaultUserData(this.fileSystem);

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

      var shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = html;

      const terminalOutput = shadowRoot.querySelector("#terminalOutput");
      const terminalInputWrapper = shadowRoot.querySelector("#terminalInputWrapper");
      const terminalInput = shadowRoot.querySelector("#terminalInput");
      const terminalPrefix = shadowRoot.querySelector("#terminalPrefix");
      terminalPrefix.textContent = "drew@Work-Dev-Laptop:~$ ";

      // Focus the terminal
      terminalInput.focus();

      // Handle keydown events
      terminalInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          const command = terminalInput.value;
          terminalInput.value = "";
          await this.handleCommand(command);
        }
      });

      // Handle command
      this.handleCommand = async (command) => {
        const commandLine = document.createElement("div");
        const outputLine = document.createElement("div");

        const commandPrefix = document.createElement("span");
        commandPrefix.textContent = "drew@Work-Dev-Laptop:~$ ";
        commandPrefix.setAttribute("class", "terminalPrefix");
        commandLine.appendChild(commandPrefix);

        const commandText = document.createElement("span");
        commandText.setAttribute("class", "commandInput");
        commandText.textContent = command;
        commandLine.appendChild(commandText);
        terminalOutput.appendChild(commandLine);

        const outputText = document.createElement("span");
        let commandResult;
        try {
          const terminalCommand = command.split(" ")[0];
          commandResult = await commandMap[terminalCommand](
            this.userData,
            this.fileSystem,
            command
          );
        } catch (error) {
          if (error.message.includes("is not a function")) {
            commandResult = `${command}: command not found`;
          } else if (error.message) {
            console.error(error);
            commandResult = `${command}: ${error.message}`;
          } else {
            commandResult = "Unknown error occurred.";
          }
        }

        outputText.textContent = commandResult;
        outputLine.appendChild(outputText);
        terminalOutput.appendChild(outputLine);

        this.history.push({ command, output: outputText.textContent });
      };

      // onclick: focus the terminalInput
      this.addEventListener("click", () => {
        terminalInput.focus();
      });
      // but allow selection of text within the terminalOutput
      terminalOutput.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      terminalInput.addEventListener("keydown", (e) => {
        // Make the arrow keys select the previous/next command from the history
        if (e.key === "ArrowUp") {
          if (this.historyIndex === -1) {
            this.historyIndex = this.history.length;
          }
          if (this.historyIndex > 0) {
            this.historyIndex--;
          }
          terminalInput.value = this.history[this.historyIndex].command;
        } else if (e.key === "ArrowDown") {
          if (this.historyIndex < this.history.length - 1 && this.historyIndex !== -1) {
            this.historyIndex++;
            terminalInput.value = this.history[this.historyIndex].command;
          } else {
            this.historyIndex = -1;
            terminalInput.value = "";
          }
        }

        // Make the (ctrl + l) clear the terminalInput ( also works with (ctrl + shift + l) or (ctrl + alt + l) or (ctrl + shift + alt + l) )
        if ((e.ctrlKey && e.key === "l") || (e.ctrlKey && e.shiftKey && e.key === "L")) {
          // Prevent the default action if this is a hotkey for the web browser
          e.preventDefault();

          terminalOutput.innerHTML = "";
        }
      });
    }
  }
  customElements.define("terminal-emulator", TerminalEmulator);
}
