import type { ExplorerNode } from "./types";

export const filesAndFolders: ExplorerNode[] = [
   {
        name: "src",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          {
            name: "pages",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "index.tsx", isFile: true , id: self.crypto.randomUUID()},
              { name: "_app.tsx", isFile: true , id: self.crypto.randomUUID()},
              {
                name: "api",
                isFile: false,
                id: self.crypto.randomUUID(),
                filesAndFolders: [
                  { name: "auth.ts", isFile: true , id: self.crypto.randomUUID()},
                  { name: "products.ts", isFile: true , id: self.crypto.randomUUID()},
                ],
              },
            ],
          },
          {
            name: "components",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              {
                name: "ui",
                isFile: false,
                id: self.crypto.randomUUID(),
                filesAndFolders: [
                  { name: "Button.tsx", isFile: true , id: self.crypto.randomUUID()},
                  { name: "Modal.tsx", isFile: true , id: self.crypto.randomUUID()},
                ],
              },
              {
                name: "layout",
                isFile: false,
                id: self.crypto.randomUUID(),
                filesAndFolders: [
                  { name: "Header.tsx", isFile: true , id: self.crypto.randomUUID()},
                  { name: "Footer.tsx", isFile: true , id: self.crypto.randomUUID()},
                  { name: "Sidebar.tsx", isFile: true , id: self.crypto.randomUUID()},
                ],
              },
              {
                name: "shared",
                isFile: false,
                id: self.crypto.randomUUID(),
                filesAndFolders: [
                  { name: "Spinner.tsx", isFile: true , id: self.crypto.randomUUID()},
                  { name: "ErrorBoundary.tsx", isFile: true , id: self.crypto.randomUUID()},
                ],
              },
            ],
          },
          {
            name: "hooks",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "useAuth.ts", isFile: true , id: self.crypto.randomUUID()},
              { name: "useFetch.ts", isFile: true , id: self.crypto.randomUUID()},
            ],
          },
          {
            name: "utils",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "formatters.ts", isFile: true , id: self.crypto.randomUUID()},
              { name: "validators.ts", isFile: true , id: self.crypto.randomUUID()},
              { name: "constants.ts", isFile: true , id: self.crypto.randomUUID() },
            ],
          },
          {
            name: "styles",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "globals.css", isFile: true , id: self.crypto.randomUUID()},
              { name: "variables.css", isFile: true , id: self.crypto.randomUUID()},
            ],
          },
        ],
      },
      { name: "next.config.js", isFile: true , id: self.crypto.randomUUID() },
      { name: "package.json", isFile: true , id: self.crypto.randomUUID() },
      { name: "tsconfig.json", isFile: true , id: self.crypto.randomUUID() },
];