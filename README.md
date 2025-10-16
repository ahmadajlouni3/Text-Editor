
# Text-Editor-UI Template Usage Instructions

## Technology Stack
This project is built with:

- **Vite**  
- **TypeScript**  
- **React**  
- **shadcn-ui**  
- **Tailwind CSS**

All `Text-Editor/ui` components have been downloaded under `@/components/ui`.

---

## File Structure

- `index.html` – HTML entry point  
- `vite.config.ts` – Vite configuration file  
- `tailwind.config.js` – Tailwind CSS configuration file  
- `package.json` – NPM dependencies and scripts  
- `src/app.tsx` – Root component of the project  
- `src/main.tsx` – Project entry point  
- `src/index.css` – Existing CSS configuration  
- `src/pages/Index.tsx` – Home page logic  

---

## Components
All `Text-Editor/ui` components are pre-downloaded and available at `@/components/ui`.

---

## Styling
- Add global styles to `src/index.css` or create new CSS files as needed.  
- Use **Tailwind CSS** classes for styling components.

---

## Development
- Import components from `@/components/ui` in your React components.  
- Customize the UI by modifying the **Tailwind** configuration.

---

## Note
- The `@/` path alias points to the `src/` directory.  
- In your TypeScript code, don’t re-export types that you’re already importing.

---

## Commands

### Install Dependencies
```bash
pnpm i
```

### Add Dependencies

```bash
pnpm add some_new_dependency
```

### Start Preview

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

