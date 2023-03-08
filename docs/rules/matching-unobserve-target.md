# matching-unobserve-target

## Rule Details

This rule enforces that all the `targets` observed through a `observe(target)` have their corresponding `unobserve(target)` in case there isn't a `disconnect` invoke.

## Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  resizeElement = createRef();
  targetNode = createRef();

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });

    this.resizeObserver.observe(this.resizeElement.current);
    this.resizeObserver.observe(this.targetNode.current);
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.resizeElement.current);
    }
  }

  render() {
    return (
      <div>
        <div ref={this.resizeElement}>...</div>
        <div ref={this.targetNode}>...</div>
      </div>
    );
  }
}
```

```js
class MyComponent extends React.Component {
  intersectionObserver = null;
  intersectionElement = createRef();
  targetNode = createRef();
  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });
    temp.observe(this.intersectionElement.current);
    temp.observe(this.targetNode.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.intersectionElement.current);
    }
  }

  render() {
    return (
      <div>
        <div ref={this.intersectionElement}>...</div>
        <div ref={this.targetNode}>...</div>
      </div>
    );
  }
}
```

## Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  intersectionObserver = null;
  resizeElement = createRef();
  targetNode = createRef();
  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });
    this.intersectionObserver = new IntersectionObserver((entries) => {
      // do things
    });
    this.resizeObserver.observe(this.resizeElement.current);
    this.intersectionObserver.observe(this.targetNode.current);
  }
  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.resizeElement.current);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.targetNode.current);
    }
  }
  render() {
    return (
      <div>
        <div ref={this.resizeElement}>...</div>
        <div ref={this.targetNode}>...</div>
      </div>
    );
  }
}
```

```js
class MyComponent extends React.Component {
  intersectionObserver = null;
  intersectionElement = createRef();
  targetNode = createRef();

  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });
    temp.observe(this.intersectionElement.current);
    temp.observe(this.targetNode.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.intersectionElement.current);
      this.intersectionObserver.unobserve(this.targetNode.current);
    }
  }

  render() {
    return (
      <div>
        <div ref={this.intersectionElement}>...</div>
        <div ref={this.targetNode}>...</div>
      </div>
    );
  }
}
```

```js
class MyComponent extends React.Component {
  resizeObserver = null;
  intersectionObserver = null;
  intersectionElement = createRef();
  targetNode = createRef();

  componentDidMount() {
    const temp = new IntersectionObserver((entries) => {
      // do things
    });
    this.resizeObserver = new ResizeObserver((entries) => {
      // do things
    });
    this.resizeObserver.observe(this.targetNode.current);
    temp.observe(this.intersectionElement.current);
    this.intersectionObserver = temp;
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.intersectionElement.current);
    }
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.targetNode.current);
    }
  }

  render() {
    return (
      <div>
        <div ref={this.intersectionElement}>...</div>
        <div ref={this.targetNode}>...</div>
      </div>
    );
  }
}
```
