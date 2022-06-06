# Web App

Responsive PWA to manage lists, books and more. Uses ReactJS and Django.

[Demo](https://app.nicholaslyz.com) (Username: `guest`, Password: `123`)


## Features

### Frontend

- :iphone: Complete [PWA][pwa] integration with automatic updates (installable as phone app)
- :milky_way: Pretty [Three.js][three-js] space background (via [React Three Fiber][react-three-fiber])
- :zap: High performance input UI (no re-renders!) with [React Hook Form][react-hook-form] (schema validation via [Yup][yup])
- [Material UI][material-ui] styling
- Stylish, responsive [scrollbars][overlay-scrollbars] on desktop and mobile
- [Virtualized scrolling][react-virtuoso]
- State management with Redux
- Query caching with [RTK Query][rtk-query]
- [Sortable tree][react-sortable-tree] for Literature genres
- Random daily wallpaper
- (Debounced) autosave on type

### Backend

:lock: Security

- :key: 2FA TOTP support with support for remembered browsers
- Session Management with ability to log out other sessions
- Session Hijacking Protection (via country code)
- :sound: Notification on new logins

:newspaper: Lists

- Undo
- Support for recurring tasks
- View completed tasks

:blue_book: Literature  

- Goodreads/Google Books API lookup

Password Generation

- Cryptographically secure in-browser password generation (via [Web Crypto API][web-crypto-api])
- [Have I Been Pwned][hibp] cached database lookup

### CI/CD

- Automatic rebuild on `git push` via [Github Actions][github-actions]

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

[pwa]: https://web.dev/progressive-web-apps/
[three-js]: https://threejs.org/
[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
[react-hook-form]: https://react-hook-form.com/
[yup]: https://github.com/jquense/yup
[material-ui]: https://v4.mui.com/getting-started/installation/
[overlay-scrollbars]: https://kingsora.github.io/OverlayScrollbars/
[rtk-query]: https://redux-toolkit.js.org/rtk-query/overview
[react-virtuoso]: https://virtuoso.dev/
[react-sortable-tree]: https://github.com/frontend-collective/react-sortable-tree
[web-crypto-api]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
[hibp]: https://haveibeenpwned.com/
[github-actions]: https://docs.github.com/en/actions