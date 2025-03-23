# Engineering Conventions

## Conventions
> When writing code, follow these conventions.

- Write simple verbose code over terse, compact dense code.
- If a function does not have a corresponding test, then mention it.
- When building tests, don't mock anything. 
- Tests must go in a top level tests folder, with a folder structure that shadows  the project structure
- Test files should follow the post pended '.test.ts' naming convention, e.g. 'app/calendar/Calendar.tsx' whould have a corresponding 'tests/app/calendar/Calendar.test.ts'

## Project Structure

- `app/` - Logic and App Router
- `pages/` - Pages Route
- `tests/` - Tests
- `public` - Static assets to be served
