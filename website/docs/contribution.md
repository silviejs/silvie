---
id: contribution
title: Contribution
---

Silvie is an open source project, and it is currently under alpha development. I'm working to make it a better framework
to be more usable for everyone. I appreciate your contributions if you are interested in developing Silvie. So feel free
to submit potential issues, report bugs, propose new features, etc. First, read this guide to get into the development 
process.

### Code of Conduct
Silvie adopts the [Contributor Covenant](https://www.contributor-covenant.org) as its Code of Conduct. Please 
[read the full text](https://github.com/silviejs/silvie/blob/main/CODE_OF_CONDUCT.md) to see what actions will and will 
not be tolerated.

## Branches
Silvie is a monorepo project. We store multiple related projects in a single [repository](https://github.com/silviejs/silvie).
If you take a look at `packages` directory, you will see other packages that are stored in this repository.

:::note
Currently the main Silvie codes are in the `src` directory, but I plan to move it into the packages to keep the 
repository clean. 
:::

### Main Branch 
The latest release will be kept in the [main branch](https://github.com/silviejs/silvie/tree/main). Pull requests that
are addressing **bug fixes** and **improvements**`, need to be submitted directly to the `main` branch.

### New Features
If you are going to develop a new feature to be added to the Silvie, You should create a new branch for that feature. 
This will make more sense when we are reviewing you work.

## Bugs
### Known Issues
You may find the issue that you have in your mind, in the [GitHub Issues](https://github.com/silviejs/silvie/issues) 
page. Before starting to work, please read the full issue discussion to see if anybody is working on the solution.

### New Issues
If you have an issue that is not listed in the issues section, you can file a new task with a detailed description of 
the issue. If it is a bug, please explain the steps required to reproduce it. 

## Proposing a Change
If you are willing to make a serious change in the project, It is recommended to file an issue to reach an agreement 
about your proposal, before you put a lot of effort into it.

It is also recommended to file an issue for small tasks like a simple bug fix. This will let us know about what you are 
fixing and lets you know if we are going to accept that fix or not.

## Pull Requests
If are ready to take your first step and start working on an issue, you need to go through the following steps:

1. Fork the [repository](https://github.com/silviejs/silvie).
2. Create a new branch from `main` if it is needed.
3. Run `npm i` or `yarn` to install packages.
4. Format your code with `Prettier`.
5. Run the `ESLint` to get linting errors.

## Style Guide
I've used [Prettier](https://prettier.io) automatic code formatter in combination with [ESLint](https://eslint.org) to
keep a universal code style allover the code base. The ESLint is configured to use the 
[Airbnb's Style Guide](https://github.com/airbnb/javascript). You need to run ESLint after you change a file, to keep 
you in the line. 

## License
Silvie is MIT licensed. So by contributing to this project, you also agree that your contributions will be MIT licensed 
too.


