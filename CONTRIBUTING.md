# Contributing to MaterialDerailleur

Thank you for your interest in contributing. This document explains how to get started, submit changes, and what we expect from contributors.

## Quick start
1. Fork the repository and create a topic branch:
   - git checkout -b feature/short-description
2. Keep branches small and focused per issue/feature.
3. Run tests and linters locally before submitting a PR.

## Development setup
- See `/client-app/README.md` and `/server/README.md` for service-specific setup.
- We use Docker Compose for local environment; use it where convenient.
- Install dependencies:
  - frontend: `cd client-app && npm install`
  - backend: `cd server && npm install`

## Coding standards
- Follow existing project style (TypeScript, React conventions).
- Run Prettier before committing:
  - `npm run prettier:write`
- Run lint & tests:
  - `npm test`
  - `npm run lint` (if available)

## Branching & commit messages
- Branch name examples:
  - feature/add-inventory-dashboard
  - bugfix/fix-login-cors
- Commit messages should be clear and concise. Use present tense:
  - "Add barcode generation endpoint"

## Pull requests
- Open a PR against `main`.
- Include:
  - Short description of the change
  - Link to related issue (if any)
  - Testing steps and expected behavior
- Add reviewers and select an appropriate label.
- Ensure CI passes and new code includes tests where applicable.

## Issues
- Use existing issue templates when creating bugs or tasks.
- Provide steps to reproduce, expected behavior, and screenshots/logs if relevant.

## Tests
- Add unit or integration tests for new behaviour.
- Mock external services (Azure, email, LLMs) in CI and unit tests.

## Security & secrets
- Do not commit secrets or credentials. Use environment variables and CI secrets.
- Report security issues privately by opening a confidential issue or contacting the maintainers.

## Code of conduct
Please follow the project's Code of Conduct (CODE_OF_CONDUCT.md) in all interactions.