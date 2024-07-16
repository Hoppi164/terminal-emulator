const defaultFileSystem = {
  "/": {
    type: "directory",
    contents: {
      home: {
        type: "directory",
        contents: {
          drew: {
            type: "directory",
            contents: {
              "hello-world.txt": {
                type: "file",
                contents: "Hello, World!",
              },
            },
          },
        },
      },

      bin: {
        type: "directory",
        contents: {
          ls: {
            type: "file",
            contents: `#!/bin/bash
                  echo "hello-world.txt"`,
          },
        },
      },

      etc: {
        type: "directory",
        contents: {
          hosts: {
            type: "file",
            contents: "",
          },
        },
      },

      var: {
        type: "directory",
        contents: {
          log: {
            type: "directory",
            contents: {
              "access.log": {
                type: "file",
                contents: "",
              },
            },
          },
        },
      },
    },
  },
};

// add a parent property to each directory
function addParents(fileSystem, parent = fileSystem["/"]) {
  for (const key in fileSystem) {
    const child = fileSystem[key];
    if (child.type === "directory") {
      child.parent = parent;
      addParents(child.contents, child);
    }
  }
}

export function getDefaultFileSystem() {
  const fileSystem = JSON.parse(JSON.stringify(defaultFileSystem));
  addParents(fileSystem);
  return fileSystem;
}
