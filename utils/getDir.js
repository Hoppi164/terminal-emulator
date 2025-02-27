export function getDir(newPath, userData, fileSystem) {
  const path = newPath.split("/");
  let absolutePath = userData.currentServerPathAbsolute;
  let newDirectory = userData.currentWorkingDirectory;

  if (newPath[0] === "/") {
    newDirectory = fileSystem["/"];
    absolutePath = "/";
  }

  for (let i = 0; i < path.length; i++) {
    const nextPathSegment = path[i];
    if (nextPathSegment === "..") {
      newDirectory = newDirectory.parent;
      absolutePath = absolutePath.split("/").slice(0, -1).join("/");
    } else if (nextPathSegment === "") {
      continue;
    } else {
      newDirectory = newDirectory.contents[nextPathSegment];
      absolutePath = `${absolutePath}/${nextPathSegment}`;
    }
  }

  return { dir: newDirectory, path: absolutePath };
}
