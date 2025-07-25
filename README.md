# Task Dashboard

A modern, performant, and accessible task management dashboard built with Next.js, React, Zustand, Tailwind CSS, and TypeScript.

## 🚀 Features

- CRUD operations for tasks
- Categories/tags with color coding
- Bulk operations (select, delete, status change)
- Task search and filtering
- Priority indicators
- Local storage persistence
- CSV export
- Undo/redo
- Drag-and-drop (optional)
- Keyboard shortcuts
- Toast notifications
- Light/dark theme toggle
- Responsive design
- Lazy loading of task cards (Intersection Observer)
- Code quality enforced with ESLint, Prettier, and Husky

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```sh
npm install
```

### Running the App

```sh
npm run dev
```

### Linting & Formatting

```sh
npm run lint
npm run format
```

### Running Unit Tests

```sh
npm run test
```

### Running E2E Tests

```sh
npm run e2e
```

### Build for Production

```sh
npm run build
```

## 🧩 Component Documentation & Key Decisions

- **Component composition:** All UI primitives are in `src/components/ui/` and reused throughout the app.
- **Custom hooks:** Used for tasks (`useTasks`), undo/redo, lazy loading (`useInView`), etc.
- **State management:** Zustand for global state, React state for local UI.
- **Styling:** Tailwind CSS v4 for utility-first, responsive design.
- **Lazy loading:** Intersection Observer API for efficient rendering of large lists.
- **Error handling:** Toast notifications and error states in UI.

## 🏗️ Architecture Decisions & Trade-offs

- **No backend:** Uses local JSON file for persistence (can be swapped for a real API).
- **Zustand vs Redux:** Chose Zustand for simplicity and performance.
- **Intersection Observer vs react-window:** Native API for lazy loading, no extra dependencies.
- **Husky/Prettier/ESLint:** Enforced code quality and style on every commit.

## ⚡ Performance Considerations

- **Lazy rendering:** Only visible task cards are rendered.
- **Memoization:** useMemo and useCallback used for expensive computations and handlers.
- **Pre-commit hooks:** Prevent slow or broken code from being committed.

## ♿ Accessibility

- All interactive elements have `aria-label`s.
- Keyboard navigation is supported.
- Color contrast and focus states are tested.
- (Bonus) Run `npx axe` or Lighthouse for accessibility audits.

## 📱 Mobile Responsiveness

- Fully responsive grid and modals.
- Tested on Chrome DevTools, iOS, and Android.

## 🧪 Unit Tests (Example)

- See `src/components/ui/__tests__/TaskCard.test.tsx` for a sample test.

## 🧪 E2E Tests (Example)

- See `e2e/add-task.spec.ts` for a sample Cypress test.

---

## 📂 File Structure

```
src/
  components/
    ui/
      ...
    task-form.tsx
    task-card.tsx
    task-list.tsx
  hooks/
  types/
  utils/
  constants/
  app/
```

---

## 📝 License

MIT
