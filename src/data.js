export const filesAndFolders = [
  {
    name: "file1.jsx",
    isFile: true,
  },
  {
    name: "src",
    isFile: false,
    filesAndFolders: [
      {
        name: "file2.jsx",
        isFile: true,
      },
      {
        name: "package.jsx",
        isFile: true,
      },
      {
        name: "component",
        isFile: false,
        filesAndFolders: [
          {
            name: "index.jsx",
            isFile: true,
          },
          {
            name: "app.jsx",
            isFile: true,
          },
          {
            name: "styles.jsx",
            isFile: true,
          },
        ],
      },
    ],
  },
  {
    name: "file5.jsx",
    isFile: true,
  },
];
