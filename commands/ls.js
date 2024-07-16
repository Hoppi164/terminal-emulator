/**
 * List files in the current directory
 * @async
 * @param {Object} userData - The current user data
 * @param {Object} fileSystem - The current file system
 * @returns {string} - A string containing the files in the current directory
 */

export async function ls(userData, fileSystem) {
  const currentDirectory = userData.currentWorkingDirectory;
  const contents = currentDirectory.contents || {};
  const content = Object.keys(contents);
  if (!content.length) {
    return "No files or directories.";
  }
  return `\n\n${content.join("  ")}`;
}
