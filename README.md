## Personal Dashboard

I'm making a dashboard of my tasks, investments and booklists using ReactJS and Django.

# Naming Conventions

- Directories: `kebab-case`
- Component directories: `PascalCase`
- Component .js files: `PascalCase`
- Non-component .js files: `camelCase`

# Directory structure

- fonts
    - font1
        - relevant css/woff/woff2 files here
    
- globals: Fixed constants used across the app
    - theme.js
    - urls.js
    
- modules
    - Module1
        - Module1.js
        - No subdirectories
    
- shared: Shared React Components
    - Component1

- test: Mocks, MSW/Jest etc

- util: Utility functions/React hooks. Larger functions in their own folder