/**
 * Prints the logged in username
 * @async
 * @param {Object} userData - The current user data
 * @returns {string} - A string containing the logged in username
 */

export async function whoami(userData) {
  return userData.username;
}
