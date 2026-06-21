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
          { name: "index.tsx", isFile: true, id: self.crypto.randomUUID(), content: `export default function Home() { return <h1>Hello, World!</h1> }` },
          { name: "_app.tsx", isFile: true, id: self.crypto.randomUUID(), content: `import { useState } from "react";` },
          {
            name: "api",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "auth.ts", isFile: true, id: self.crypto.randomUUID(), content: `export const authenticate = () => { /* ... */ };` },
              { name: "products.ts", isFile: true, id: self.crypto.randomUUID(), content: `export const getProducts = () => { /* ... */ };` },
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
              { name: "Button.tsx", isFile: true, id: self.crypto.randomUUID(), content: `export default function Button() { return <button>Click me</button> }` },
              { name: "Modal.tsx", isFile: true, id: self.crypto.randomUUID(), content: `export default function Modal() { return <div>Modal Content</div> }` },
            ],
          },
          {
            name: "layout",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "Header.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "Footer.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "Sidebar.tsx", isFile: true, id: self.crypto.randomUUID() },
            ],
          },
          {
            name: "shared",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "Spinner.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "ErrorBoundary.tsx", isFile: true, id: self.crypto.randomUUID() },
            ],
          },
        ],
      },
      {
        name: "hooks",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "useAuth.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "useFetch.ts", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
      {
        name: "utils",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "formatters.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "validators.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "constants.ts", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
      {
        name: "styles",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "globals.css", isFile: true, id: self.crypto.randomUUID() },
          { name: "variables.css", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
    ],
  },
  { name: "next.config.js", isFile: true, id: self.crypto.randomUUID() },
  {
    name: "package.json", isFile: true, id: self.crypto.randomUUID(), content: `{
  "name": "react",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "main": "src/index.tsx",
  "dependencies": {
    "@tailwindcss/postcss": "^4.3.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.21.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.0",
    "shadcn": "^4.11.0",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.1",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "loader-utils": "3.2.1",
    "typescript": "5.7.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
`},
  { name: "tsconfig.json", isFile: true, id: self.crypto.randomUUID() },
];