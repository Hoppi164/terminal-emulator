export function getDefaultFileSystem() {
  return {
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
}
