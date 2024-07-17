import { getDir } from "../utils/getDir.js";

/**
 * Print the contents of a file to the terminal
 * @async
 * @param {Object} userData - The current user data
 * @param {Object} fileSystem - The current file system
 * @param {string} command - The command to execute, should include the file to read
 * @returns {string} - A string containing the contents of the file
 */

export async function cat(userData, fileSystem, command) {
  const filePath = command.split("cat ")[1];

  if (!filePath) {
    return "Error: no file specified";
  }

  const { dir } = getDir(filePath, userData, fileSystem);
  const file = dir;
  if (file.type === "directory") {
    throw new Error("Is a directory");
  }

  if (file.type !== "file") {
    throw new Error("Not a file");
  }

  if (!file) {
    throw new Error("No such file or directory");
  }

  return file.contents;
}
