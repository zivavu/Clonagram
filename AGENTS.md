<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know. It's version 16.2.4.

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

ALWAYS read docs before coding.
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:stylex-agent-rules -->

This project uses StyleX (@stylexjs/stylex) for all styling.
Do NOT use Tailwind CSS classes or suggest them.
All styles must use stylex.create() and stylex.props().
When importing tokens(colors, radius) from `tokens.stylex.ts`, always use relative imports, for example `../../styles/tokens.stylex`.

<!-- END:stylex-agent-rules -->

<!-- BEGIN:package-manager-rules -->

Use bun as a the package manager and code runner, exclusively.

<!-- END:package-manager-rules -->

<!-- BEGIN:naming-convention-rules -->

# Component naming convention

Components that are the root of their folder MUST use `index.tsx` + `index.stylex.ts`.
Each component gets its own folder named after the component, with `index.tsx` and `index.stylex.ts` files inside.
This keeps imports clean (`./components/MyComponent` rather than `./components/MyComponent/MyComponent`).

<!-- END:naming-convention-rules -->

<!-- BEGIN:state-management-rules -->

# State management

Use Zustand for all state management needs.
Avoid React Context for global state unless absolutely necessary.

<!-- END:state-management-rules -->

<!-- BEGIN:client-components-rules -->

# Client Components

Avoid "use client" at all costs. Prefer Server Components by default.
Only add "use client" when absolutely required (e.g., browser-only APIs, hooks that require client context).
Push interactivity to the leaf nodes of the component tree.

<!-- END:client-components-rules -->

<!-- BEGIN:testing-rules -->

# Testing

Do not write tests or test files.

<!-- END:testing-rules -->

<!-- BEGIN:css-efficiency-rules -->

# CSS Efficiency

Do not add redundant or non-functional styles. Respect the global resets.
Buttons already have `cursor: pointer`, links already have `text-decoration: none`, and the root font stack is already defined.
Do not add `cursor: pointer` to buttons, `textDecoration: none` to links, or other declarations that do not change the computed style.
Every StyleX class and container must serve a purpose.

<!-- END:css-efficiency-rules -->

<!-- BEGIN:dry-rules -->

# Do Not Reimplement Logic

If logic, markup, or styling is needed in more than one place, extract it into a reusable component, utility function, or shared StyleX definition.
Do not copy-paste or rewrite the same logic across files.

<!-- END:dry-rules -->

<!-- BEGIN:icon-rules -->

# Icons

Use `react-icons` for all icons.
Do not use custom inline SVG or raw SVG files.

<!-- END:icon-rules -->

<!-- BEGIN:typescript-rules -->

# TypeScript

Never use `any`.
Always define proper types and interfaces. Prefer explicit return types on exported functions.

<!-- END:typescript-rules -->

<!-- BEGIN:biome-config -->

# Biome Configuration

Use Biome for formatting and linting. Key settings:
- Line width: 120
- Indent: 3 spaces
- Line ending: lf
- Quotes: single
- Trailing commas: all
- Semicolons: always
- Bracket spacing: true
- Arrow parentheses: as needed
- Organize imports: enabled
- No unused imports: error
- No explicit any: error
- No console: warn
- Use exhaustive dependencies: error

<!-- END:biome-config -->

<!-- BEGIN:file-size-rules -->

# File Size

If a file gets larger than 300 lines, extract components into separate folders.
Keep files focused and readable.

<!-- END:file-size-rules -->

<!-- BEGIN:react-compiler-rules -->

# React Compiler

This project uses React Compiler. Do not manually add `useMemo`, `useCallback`, or `React.memo` — the compiler handles memoization automatically.

The only exception is when you need precise control over a memoized value used as an effect dependency, to prevent an effect from firing repeatedly when its dependencies haven't meaningfully changed.

<!-- END:react-compiler-rules -->

<!-- BEGIN:commit-rules -->

# Commit Conventions

After every medium-sized feature, commit with a very short commit message(3-7 words).
Capitalize the first letter. Do not use prefixes like "chore:", "feat:", "fix:", etc.
Example: "Add user profile page" not "feat: add user profile page".

<!-- END:commit-rules -->

<!-- BEGIN:clarification-rules -->

# Ask for Clarification

If you are unsure about something, the prompt is too vague, you see multiple valid options, or you feel something needs to be specified — stop and ask the user for clarification before proceeding.
Do not guess or make assumptions when the right path is ambiguous.

<!-- END:clarification-rules -->

<!-- BEGIN:no-comments-rules -->

# No Comments

Do not write comments in code. Write self-explanatory code with clear variable and function names instead.

<!-- END:no-comments-rules -->

<!-- BEGIN:linting-rules -->

# Linting

After finishing any coding task, always run the linter:
```
bun biome check --write .
```
Fix any errors before considering the task complete.

<!-- END:linting-rules -->
