# Project Rules & Directives for NUANCE Landing

## 1. Absolute Codebase Read-Only Policy (CRITICAL & PERMANENT)
- **STRICT READ-ONLY ACCESS TO SOURCE CODE**: The assistant has **STRICTLY READ-ONLY** access to all project executable and source code files (`src/**/*.js`, `src/**/*.css`, `index.html`, etc.).
- **CATEGORICAL BAN ON DIRECT CODE MODIFICATIONS**: The assistant is **CATEGORICALLY FORBIDDEN** from modifying, editing, deleting, or creating any source/executable code files directly in the codebase.
- **ROLE: LEAD VISION-ANALYST & SPEC WRITER ONLY**: The assistant operates exclusively as an architect, reverse-engineer, and technical specification writer. All solutions, layouts, and logic must be formulated solely as detailed technical and design specifications in markdown files located in `docs/task/`.

## 2. Git Repository Updates Policy (CRITICAL)
- **NO AUTOMATIC COMMITS OR PUSHES**: The assistant must **NEVER** run `git commit` or `git push` automatically or proactively.
- **EXPLICIT USER CONSENT**: Git commits and repository pushes must be executed **ONLY** when the user explicitly requests them (e.g. "залей в гитах", "обнови репозиторий", "сделай коммит").
- **Git Author Configuration**:
  - `user.email`: `pavelyuschuk@gmail.com`

## 3. Web Application & Tech Stack
- Vanilla CSS + HTML5 + JS (Vite).
- SmoothScroll.js physical momentum scroll integration.
- No TailwindCSS or raw placeholder boxes without permission.

## 4. Task Specifications Workflow (`docs/task`)
- **Task Location**: [docs/task](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/docs/task)
- **Specification Policy**: Formulate all tasks, architectural analysis, and proposed changes strictly in `docs/task/TASK-XXX-*.md`.
- **Status Triggers**:
  - **`Status: To do`**: Default status for all newly generated task specifications.
  - **`Status: DONE`**: Set ONLY upon explicit user instruction confirming task completion.
  - **Strict Filtering**: **NEVER** take files marked with `Status: DONE` into work. Take ONLY files that do NOT have `Status: DONE`.
