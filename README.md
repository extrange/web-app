# Personal Dashboard

I'm making a dashboard of my tasks, investments and booklists using ReactJS and Django.

## Naming Conventions

- Directories: `kebab-case`
- Component directories: `PascalCase`
- Component .js files: `PascalCase`
- Non-component .js files: `camelCase`

## Directory structure

- `/app`: app-wide setup and globals that depend on all the other folders.
- `/common`: shared components and utilities e.g. fonts, networking
- `/modules`
    - `Module1`: No subdirectories
      - `Module1.js`
- `/test`: Mocks, MSW/Jest etc

## Misc

- `.github/workflows/main.yml` configures the CI process
- Check for circular dependencies with `madge -c src` before pushing to `master`