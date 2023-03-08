# no-missing-unobserve-or-disconnect

## Rule Details

This rule enforces that there be a `disconnect` or `unobserve` for all `observe` that have been invoked

## Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  resizeElement = createRef();

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });

    this.resizeObserver.observe(this.resizeElement.current);
  }

  componentWillUnmount() {}

  render() {
    return <div ref={this.resizeElement}>...</div>;
  }
}
```

```js
class MyComponent extends React.Component {
  intersectionObserver = null;
  intersectionElement = createRef();

  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });

    temp.observe(this.intersectionElement.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
    }
  }
  render() {
    return <div ref={this.intersectionElement}>...</div>;
  }
}
```

## Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  resizeElement = createRef();

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });

    this.resizeObserver.observe(this.resizeElement.current);
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  render() {
    return <div ref={this.resizeElement}>...</div>;
  }
}
```

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  resizeElement = createRef();

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });

    this.resizeObserver.observe(this.resizeElement.current);
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.resizeElement.current);
    }
  }

  render() {
    return <div ref={this.resizeElement}>...</div>;
  }
}
```

```js
class MyComponent extends React.Component {
  intersectionObserver = null;
  intersectionElement = createRef();

  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });

    temp.observe(this.intersectionElement.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.intersectionElement.current);
    }
  }

  render() {
    return <div ref={this.intersectionElement}>...</div>;
  }
}
```

```js
class MyComponent extends React.Component {
  intersectionObserver = null;
  intersectionElement = createRef();

  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });

    temp.observe(this.intersectionElement.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
  render() {
    return <div ref={this.intersectionElement}>...</div>;
  }
}
```
