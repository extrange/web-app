# Personal Dashboard

I'm making a dashboard of my tasks, investments and booklists using ReactJS and Django.

## Naming Conventions

- Directories: `kebab-case`
- Component directories: `PascalCase`
- Component .js files: `PascalCase`
- Non-component .js files: `camelCase`

## Directory structure

- `app/`: app-wide setup and globals that depend on all the other folders e.g. - auth, notifications, network error/loading statuses
- `modules/`:
  - `Module1/`: No subdirectories
    - `Module1.js`
    - `moduleApi.js`: RTK Query definitions via `injectEndpoints`
    - `moduleSlice.js`: Module specific actions/reducers via `createSlice`
- `shared/`:
  - `components/` Shared components e.g. `GenericList`
  - `static/`: Images, fonts
  - `useSomeHook.js`
  - `util.js`
- `test/`: Mocks (MSW) and tests
  - `mocks/`:
    - `module1/`
      - `module1Api.js`: MSW definitions for module1's api
      - `module1FakeData.js`
    - `browser.js`: MSW endpoint

## Misc

- `.github/workflows/main.yml` configures the CI process
- Check for circular dependencies with `madge -c src` before pushing to `master`