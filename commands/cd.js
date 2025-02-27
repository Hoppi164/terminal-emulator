import { getDir } from "../utils/getDir.js";

/**
 * Changes the current directory to the specified directory
 * @async
 * @param {Object} userData - The current user data
 * @param {Object} fileSystem - The current file system
 * @param {string} command - The command to execute, should include the directory to change to
 * @returns {string} - A empty string if successful, an error message if not
 */

export async function cd(userData, fileSystem, command) {
  if (!command.includes("cd")) {
    return "Error: not a valid command";
  }

  const newDirectoryPath = command.split("cd ")[1];

  if (!newDirectoryPath) {
    return "Error: no directory specified";
  }

  const { dir, path } = getDir(newDirectoryPath, userData, fileSystem);

  if (!dir) {
    throw new Error("No such file or directory");
  }
  
  if (dir.type !== "directory") {
    throw new Error("Not a directory");
  }
  
  userData.currentWorkingDirectory = dir;
  userData.currentServerPathAbsolute = path;
}
