# @example/typescript

A demo to show you how you can deploy your first TypeScript registry to jsrepo.com.

Within is an example of an over-engineered calculator to help demonstrate how jsrepo works.

### Relevant Links

-   [jsrepo](https://github.com/jsrepojs/jsrepo)
-   [jsrepo.com](https://jsrepo.com)

### Prerequisites

-   Have an account on [jsrepo.com](https://jsrepo.com)

## Tutorial

In this tutorial we will cover how to build and publish a simple TypeScript registry to [jsrepo.com](https://jsrepo.com).

### 1. Initialize a TypeScript project

Start by initializing a TypeScript project (I will use pnpm for this)

```sh
pnpm init

pnpm install typescript -D

pnpm tsc --init
```

### 2. Create your components

Now lets create some components that we want to share.

Lets create a `./src` directory and within it we can create a `/utils` folder.

Your project should now look something like this:

```plaintext
root
├── /src
│   └── /utils
├── package.json
└── tsconfig.json
```

Now let's add our components.

`calculator.ts`:

```ts
import { Logger } from "./logger";

export class Calculator {
	add(a: number, b: number): ArithmeticResult {
		return new ArithmeticResult(a + b);
	}

	subtract(a: number, b: number): ArithmeticResult {
		return new ArithmeticResult(a - b);
	}
}

export class ArithmeticResult {
	private val: number;
	private logger = new Logger();

	constructor(result: number) {
		this.val = result;
	}

	print() {
		this.logger.success(`The answer is ${this.val}!`);
	}

	get value() {
		return this.val;
	}
}
```

`logger.ts`:

```ts
import color from "chalk";

export class Logger {
	private logger: typeof console.log;

	constructor(logger = console.log) {
		this.logger = logger;
	}

	success(msg: string) {
		this.logger(`${color.cyan("[success]")} ${msg}`);
	}

	failure(msg: string) {
		this.logger(`${color.cyan("[failure]")} ${msg}`);
	}
}
```

## 3. Prepare the registry for publish

Now that we have our components let's configure `jsrepo` to publish our registry to [jsrepo.com](https://jsrepo.com).

Start by running the init command:

```sh
pnpm dlx jsrepo init --registry
```

When asked _"Where are your blocks located?"_ answer `./src` because that is where our categories are.

Answer yes to _"Configure to publish to jsrepo.com?"_ and then input the name of your registry.

> The name of the registry should be in the format of `@<scope>/<name>`. If you don't already have a scope you can claim one [here](https://jsrepo.com/account/scopes/new).

```plaintext
┌   jsrepo  v2.0.0
│
◇  Where are your blocks located?
│  ./src
│
◇  Add another blocks directory?
│  No
│
◇  Configure to publish to jsrepo.com?
│  Yes
│
◇  What's the name of your registry?
│  @example/typescript
│
◇  Added script to package.json
│
◇  Wrote config to `jsrepo-build-config.json`
│
├ Next Steps ─────────────────────────────────────────────────────┐
│                                                                 │
│   1. Add categories to `./src`.                                 │
│   2. Run `pnpm run release:registry` to publish the registry.   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┘
│
└  All done!
```

Now your registry should be ready to publish!

## 4. Publish your registry

Now that your registry has been configured to publish to [jsrepo.com](https://jsrepo.com) let's authenticate to the jsrepo CLI.

```sh
jsrepo auth

# or

jsrepo auth --token <...>
```

Once you are authenticated let's do a dry run to make sure we got everything right:

```sh
jsrepo publish --dry-run
```

If all went well you should see:

```plaintext
◆  [jsrepo.com] Completed dry run!
```

See it? Great! Now let's do it for real!

```sh
jsrepo publish
```

And there you go you published your first registry to [jsrepo.com](https://jsrepo.com).

Now you can access your components through the `jsrepo` CLI.

```sh
jsrepo init @example/typescript

jsrepo add # list components

jsrepo add utils/calculator # add individual
```

and from the [jsrepo.com](https://jsrepo.com) page for your registry located at `https://jsrepo.com/@<scope>/<name>`.

## 5. Advanced usage

### Un-listing blocks

Now let's do a few things to improve our registry.

First of all when we run the `jsrepo add` command right now to list our components we see `calculator` and `logger`. Since `logger` is just an internal helper for `calculator` why don't we prevent it from coming up on this list.

We can do this with the `doNotListBlocks` key in our `jsrepo-build-config.json` file:

```jsonc
{
	// -- snip --
	"doNotListBlocks": ["logger"]
	// -- snip --
}
```

Now when we list our blocks only `calculator` will appear.

> Alternatively if we had more internal utils we could use `listBlocks` and only include `calculator` to prevent others from showing up here.

### Metadata

[jsrepo.com](https://jsrepo.com) uses metadata you provide in your `jsrepo-build-config.json` to display on your registries homepage.

```jsonc
{
	// -- snip --
	"meta": {
		"authors": ["Aidan Bleser"],
		"bugs": "https://github.com/jsrepojs/example-typescript",
		"description": "A demo to show you can you can deploy your first typescript registry to jsrepo.com",
		"homepage": "https://github.com/jsrepojs/example-typescript",
		"repository": "https://github.com/jsrepojs/example-typescript",
		"tags": ["registry", "typescript", "example", "jsrepo"]
	},
	// -- snip --
}
```

### Changesets

Another thing you may want to setup if you are publishing a registry to [jsrepo.com](https://jsrepo.com) is [changesets](https://github.com/changesets/changesets).

Changesets are an awesome way to manage the versioning of your registry let's set them up here.

```sh
pnpm install @changesets/cli -D

pnpm changeset init
```

Now that you have changesets initialized let's make a small modification to the `.changeset/config.json` file:

```diff
{
  // -- snip --
+ "privatePackages": {
+   "tag": true,
+   "version": true
+ }
}
```

Let's also modify our `package.json` so that our release get's tagged when we publish a new version:

```diff
{
	// -- snip --
	"scripts": {
+		"release:registry": "jsrepo publish && changeset tag"
	}
	// -- snip --
}
```

And finally let's modify our `jsrepo-build-config.json` file to use the version from our `package.json`:

> You'll want to make sure that the version in your `package.json` matches the version in your `jsrepo-build-config.json` before continuing.

```diff
{
	// -- snip --
+	"version": "package",
	// -- snip --
}
```

Finally let's create a workflow so that we can publish a new version of our registry whenever there are changesets.

> If you are publishing from a workflow make sure to create a token [here](https://jsrepo.com/account/access-tokens/new) and add it with the name `JSREPO_TOKEN` under `Settings / Secrets and variables / Actions`

`.github/workflows/publish.yml`
```yaml
name: Publish

on:
    push:
        branches:
            - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
    release:
        name: Build & Publish Release
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4
            - uses: pnpm/action-setup@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20"
                  cache: pnpm

            - name: Install dependencies
              run: pnpm install

            - name: Create Release Pull Request or Publish
              id: changesets
              uses: changesets/action@v1
              with:
                  commit: "chore(release): version package"
                  title: "chore(release): version package"
                  publish: pnpm release:registry
              env:
                  JSREPO_TOKEN: ${{ secrets.JSREPO_TOKEN }} # !! DON'T FORGET THIS !!
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                  NODE_ENV: production
```

Now lets create a changeset:
```sh
pnpm changeset
```

Now once we commit our changeset to main changesets will automatically open a PR and version our package for us to create a release.
