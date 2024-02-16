# Developing

## Local setup

Ensure you have node.js 20 and Yarn 3 installed. Run `yarn` from the root of the
repo and you're good to go

## Testing

Tests are written using Jest, and live alongside production code with the file
extension `.test.ts`.

For example, the tests for `message.ts` live in `message.test.ts`

## Linting

Linting using eslint has been configured.

You can see the rules and plugins we're using in [.eslintrc.json](../.eslintrc.json)

## Pre-Commit Hooks

Pre-commit hooks have been set up using Husky. When you commit:
- The linter is ran
- Code is formatted using Prettier
- The code is bundled, transpiled, and minified using [ncc]

The transpiled code is committed to the repo as GitHub Actions requires a single
JavaScript file as an entrypoint. This is a standard pattern for GitHub Actions
written in TypeScript.

The workflow that runs on PRs includes a check to make sure that the bundled
code has been committed. If you've made changes to the TypeScript code but the
resulting changes to the `dist/` directory haven't been committed for some
reason, the workflow will fail.

[ncc]: https://github.com/vercel/ncc
