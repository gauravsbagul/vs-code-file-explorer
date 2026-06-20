import type { ExplorerNode } from "./types";

export const filesAndFolders: ExplorerNode[] = [
  {
    name: "my-app",
    isFile: false,
    filesAndFolders: [
      {
        name: "src",
        isFile: false,
        filesAndFolders: [
          {
            name: "pages",
            isFile: false,
            filesAndFolders: [
              { name: "index.tsx", isFile: true },
              { name: "_app.tsx", isFile: true },
              {
                name: "api",
                isFile: false,
                filesAndFolders: [
                  { name: "auth.ts", isFile: true },
                  { name: "products.ts", isFile: true },
                ],
              },
            ],
          },
          {
            name: "components",
            isFile: false,
            filesAndFolders: [
              {
                name: "ui",
                isFile: false,
                filesAndFolders: [
                  { name: "Button.tsx", isFile: true },
                  { name: "Modal.tsx", isFile: true },
                ],
              },
              {
                name: "layout",
                isFile: false,
                filesAndFolders: [
                  { name: "Header.tsx", isFile: true },
                  { name: "Footer.tsx", isFile: true },
                  { name: "Sidebar.tsx", isFile: true },
                ],
              },
              {
                name: "shared",
                isFile: false,
                filesAndFolders: [
                  { name: "Spinner.tsx", isFile: true },
                  { name: "ErrorBoundary.tsx", isFile: true },
                ],
              },
            ],
          },
          {
            name: "hooks",
            isFile: false,
            filesAndFolders: [
              { name: "useAuth.ts", isFile: true },
              { name: "useFetch.ts", isFile: true },
            ],
          },
          {
            name: "utils",
            isFile: false,
            filesAndFolders: [
              { name: "formatters.ts", isFile: true },
              { name: "validators.ts", isFile: true },
              { name: "constants.ts", isFile: true },
            ],
          },
          {
            name: "styles",
            isFile: false,
            filesAndFolders: [
              { name: "globals.css", isFile: true },
              { name: "variables.css", isFile: true },
            ],
          },
        ],
      },
      { name: "next.config.js", isFile: true },
      { name: "package.json", isFile: true },
      { name: "tsconfig.json", isFile: true },
    ],
  },
];