# eslint-plugin-observers

ESLint plugin for preventing memory leaks around observers ([ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver))


## Installation

You'll first need to install [ESLint](http://eslint.org):

| npm | yarn | pnpm |
| --- | ---- | ---- |
| `npm i eslint --save-dev` | `yarn add eslint --dev` | `pnpm add eslint -D` |

Next, install `eslint-plugin-observers`:

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-observers` globally.

## Usage

Add `observers` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["observers"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "observers/no-missing-unobserve-or-disconnect": "error",
    "observers/matching-unobserve-target": "error",
  }
}
```

_or_

You can use our "recommended" settings which enables most of the rules for you

```json
{
  "extends": ["plugin:observers/recommended"]
}
```

We also support a "strict" settings which enabled all of the rules for you

```json
{
  "extends": ["plugin:observers/strict"]
}
```


# Acknowledgments

This package is based on [eslint-plugin-listeners](https://github.com/foad/eslint-plugin-listeners)
Most of the functions were reused or based on functions used in [eslint-plugin-listeners] (https://github.com/foad/eslint-plugin-listeners)
That's why it deserves a lot of credits.