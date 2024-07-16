export function getDefaultUserData(fileSystem) {
  return {
    currentWorkingDirectory: fileSystem["/"],
    currentServerPathAbsolute: "/",
  };
}
