import { getDir } from "../utils/getDir.js";

/**
 * Copy a file from one directory to another
 * @async
 * @param {Object} userData - The current user data
 * @param {Object} fileSystem - The current file system
 * @param {string} command - The command to execute, should include the directory to change to
 * @returns {string} - A empty string if successful, an error message if not
 */

export async function cp(userData, fileSystem, command) {
  if (!command.includes("cp")) {
    return "Error: not a valid command";
  }

  const cpCommand = command.split("cp ")[1];
  const [oldDirectoryPath, newDirectoryPath] = cpCommand.split(" ");

  if (!oldDirectoryPath) {
    return "Error: no directory specified";
  }

  let { dir, path } = getDir(oldDirectoryPath, userData, fileSystem);
  let oldDir = dir;
  let oldPath = path;
  let oldName = oldPath.split("/").pop();
  if (oldDir.type === "directory") {
    throw new Error(`-r not specified; omitting directory '${oldDirectoryPath}'`);
  }

  let newDirData = getDir(newDirectoryPath, userData, fileSystem);
  let newDir = newDirData.dir;
  let newPath = newDirData.path;
  let newName = newPath.split("/").pop();

  if (!newDir) {
    // Copy file into new file
    userData.currentWorkingDirectory.contents[newName] = structuredClone(oldDir);
    return "";
  }

  if (newDir.type === "directory") {
    // Copy file into directory
    newDir.contents[oldName] = structuredClone(oldDir);
    return "";
  }

  if (newDir.type === "file") {
    // Copy file into file
    newDir.contents = oldDir.contents;
    return "";
  }
}
