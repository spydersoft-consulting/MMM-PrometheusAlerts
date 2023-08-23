# Welcome to the MMM-PrometheusAlerts contributing guide <!-- omit in toc -->

Thank you for investing your time in contributing to our project!

This project adheres to the [Github Contributor Code of Conduct](https://github.com/github/docs/blob/main/CODE_OF_CONDUCT.md).

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

Use the table of contents icon on the top left corner of this document to get to a specific section of this guide quickly.

## New contributor guide

To get an overview of the project, read the [README](README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

To navigate our codebase with confidence, see [the introduction to working in the docs repository](/contributing/working-in-docs-repository.md) :confetti_ball:. For more information on how we write our markdown files, see [the GitHub Markdown reference](contributing/content-markup-reference.md).

Check to see what [types of contributions](/contributing/types-of-contributions.md) we accept before making changes. Some of them don't even require writing a single line of code :sparkles:.

### Issues

#### Create a new issue

If you spot a problem with the docs, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using the [issue form](https://github.com/spyder007/MMM-PrometheusAlerts/issues/new/choose).

#### Solve an issue

Scan through our [existing issues](https://github.com/spyder007/MMM-PrometheusAlerts/issues) to find one that interests you. You can narrow down the search using `labels` as filters. See [Labels](/contributing/how-to-use-labels.md) for more information. If you find an issue to work on, you are welcome to open a PR with a fix.

### Make Changes

#### Make changes locally

1. [Install and Configure](https://docs.magicmirror.builders/getting-started/installation.html) an instance of MagicMirror for testing. It is very helpful to read and understand [Module Development](https://docs.magicmirror.builders/development/introduction.html) in Magic Mirror.

2. Fork the repository

- Using GitHub Desktop:
- [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop) will guide you through setting up Desktop.
- Once Desktop is set up, you can use it to [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

- Using the command line:
  - [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) so that you can make your changes without affecting the original project until you're ready to merge them.

3. Install or update to **Node.js v18**.

4. Clone your forked repository. In order to test locally, clone your repository into the `modules` folder of the MagicMirror repository.

5. Create a working branch and start with your changes!

### Commit your update

Commit the changes once you are happy with them. Don't forget to run the linting and test commands:

#### Linting Commands

```bash
# Run ESLint on Javascript files
npm run lint:js
# Run Prettier on all files
npm run lint:prettier

# run everything above - *** Recommended before commit ***
npm run lint
```

#### Test Commands

```bash
# Run all tests (unit, prettier, and js)
npm run test

# Run unit tests
npm run test:unit

# Check for prettier syntax violations (does not fix)
npm run test:prettier

# Check for ESLint JS syntax violations (does not fix)
npm run test:js

```

#### Build Commands

This module is written and tested using Typescript and SCSS, however, to be used by MagicMirror, `rollup` must execute and create the necessary Javascript and CSS files for the module and the `node_helper`.

This is all encapsulated in the build command:

```bash
# build module JS files from typescript
npm run build
```

You can use `npm run dev` to build with inline source maps, and `npm run watch` to build (and rebuild) on changes.

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a Docs team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

### Your PR is merged

Congratulations :tada::tada: We thank you for your contribution.

Once your PR is merged, your updates are available in MagicMirror by pulling the latest code from the `main` branch in this repository into your Magic Mirror `modules` folder and running `npm install`
