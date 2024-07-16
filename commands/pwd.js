/**
 * Prints the current working directory
 * @async
 * @param {Object} userData - The current user data
 * @param {Object} fileSystem - The current file system
 * @returns {string} - The current working directory
 */
export async function pwd(userData, fileSystem) {
  if (!userData) {
    throw new Error("Error: unknown user");
  }
  if (!fileSystem) {
    throw new Error("Error: unknown file system");
  }

  if (userData.currentServerPathAbsolute.startsWith("//")) {
    return userData.currentServerPathAbsolute.slice(1);
  }

  return userData.currentServerPathAbsolute;
}
