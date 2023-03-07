const { RuleTester } = require('eslint');
const createRule = require('../../../lib/rules/observers').createRule;
const RuleType = require('../../../lib/utils').RuleType;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
});

ruleTester.run('no-missing-unobserve-or-disconnect', createRule(RuleType.NoMissingUnobserveOrDisconnect), {
  valid: [
    {
      code: `
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
        return (
          <div ref={this.resizeElement}>
            ...
          </div>
        );
      }
    }
    `,
    },
    {
      code: `
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
        return (
          <div ref={this.resizeElement}>
            ...
          </div>
        );
      }
    }
    `,
    },
    {
      code: `
    class MyComponent extends React.Component {
      intersectionObserver = null;
      intersectionElement = createRef();
    
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });

        temp.observe(this.intersectionElement.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(this.intersectionElement.current);
        }
      }
    
      render() {
        return (
          <div ref={this.intersectionElement}>
            ...
          </div>
        );
      }
    }
    `,
    },
    {
      code: `
    class MyComponent extends React.Component {
      intersectionObserver = null;
      intersectionElement = createRef();
    
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });

        temp.observe(this.intersectionElement.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
        }
      }
      render() {
        return (
          <div ref={this.intersectionElement}>
            ...
          </div>
        );
      }
    }
    `,
    },
  ],
  invalid: [
    {
      code: `
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
        }
      
        render() {
          return (
            <div ref={this.resizeElement}>
              ...
            </div>
          );
        }
      }
      `,
      errors: [
        {
          message: 'this.resizeObserver does not have a corresponding Unobserve or Disconnnect',
        },
      ],
    },
    {
      code: `
    class MyComponent extends React.Component {
      intersectionObserver = null;
      intersectionElement = createRef();
    
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });

        temp.observe(this.intersectionElement.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
        }
      }
      render() {
        return (
          <div ref={this.intersectionElement}>
            ...
          </div>
        );
      }
    }
    `,
      errors: [
        {
          message: 'this.intersectionObserver does not have a corresponding Unobserve or Disconnnect',
        },
      ],
    },
  ],
});
