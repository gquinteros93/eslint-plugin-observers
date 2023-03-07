const { RuleTester } = require('eslint');
const createRule = require('../../../lib/rules/observers').createRule;
const RuleType = require('../../../lib/utils').RuleType;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
});

ruleTester.run('no-missing-unobserve-or-disconnect', createRule(RuleType.MatchingUnobserveTarget), {
  valid: [
    {
      code: `
    class MyComponent extends React.Component {
      resizeObserver = null;
      intersectionObserver = null;
      resizeElement = createRef();
      targetNode  = createRef();
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
            <div ref={this.resizeElement}>
              ...
            </div>
            <div ref={this.targetNode}>
              ...
            </div>
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
      targetNode  = createRef();
  
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });
        temp.observe(this.intersectionElement.current);
        temp.observe(this.targetNode.current);
        this.intersectionObserver = temp
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
            <div ref={this.intersectionElement}>
              ...
            </div>
            <div ref={this.targetNode}>
              ...
            </div>  
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
      intersectionObserver = null;
      intersectionElement = createRef();
      targetNode  = createRef();
  
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });
        this.resizeObserver = new ResizeObserver((entries) => {
          // do things
        });
        this.resizeObserver.observe(this.targetNode.current);
        temp.observe(this.intersectionElement.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(this.intersectionElement.current);
          this.resizeObserver.unobserve(this.targetNode.current);
        }
      }

      render() {
        return (
          <div>
            <div ref={this.intersectionElement}>
              ...
            </div>
            <div ref={this.targetNode}>
              ...
            </div>  
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
          targetNode  = createRef();
        
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
                <div ref={this.resizeElement}>
                  ...
                </div>
                <div ref={this.targetNode}>
                  ...
                </div>  
              </div>
            );
          }
        }
        `,
      errors: [
        {
          message: "there isn't an unobserve invoke for this.resizeObserver with target this.targetNode",
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          resizeObserver = null;
          resizeElement = createRef();
          targetNode  = createRef();
        
          componentDidMount() {
            this.resizeObserver = new ResizeObserver((entries) => {
              // do things
            });
        
            this.resizeObserver.observe(this.resizeElement.current);
            this.resizeObserver.observe(this.targetNode.current);
          }
        
          componentWillUnmount() {
            if (this.resizeObserver) {
              this.resizeObserver.unobserve(this.targetNode.current);
            }
          }
        
          render() {
            return (
              <div>
                <div ref={this.resizeElement}>
                  ...
                </div>
                <div ref={this.targetNode}>
                  ...
                </div>  
              </div>
            );
          }
        }
        `,
      errors: [
        {
          message: "there isn't an unobserve invoke for this.resizeObserver with target this.resizeElement",
        },
      ],
    },
    {
      code: `
    class MyComponent extends React.Component {
      intersectionObserver = null;
      intersectionElement = createRef();
      targetNode  = createRef();
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });
        temp.observe(this.intersectionElement.current);
        temp.observe(this.targetNode.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(this.intersectionElement.current);
        }
      }
    
      render() {
        return (
          <div>
            <div ref={this.intersectionElement}>
              ...
            </div>
            <div ref={this.targetNode}>
              ...
            </div>  
          </div>
        );
      }
    }
    `,
      errors: [
        {
          message: "there isn't an unobserve invoke for this.intersectionObserver with target this.targetNode",
        },
      ],
    },
    {
      code: `
    class MyComponent extends React.Component {
      intersectionObserver = null;
      intersectionElement = createRef();
      targetNode  = createRef();
      componentDidMount() {
        const temp = new IntersectionObserver((entries) => {
          // do things
        });
        temp.observe(this.intersectionElement.current);
        temp.observe(this.targetNode.current);
        this.intersectionObserver = temp
      }
    
      componentWillUnmount() {
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(this.targetNode.current);
        }
      }
    
      render() {
        return (
          <div>
            <div ref={this.intersectionElement}>
              ...
            </div>
            <div ref={this.targetNode}>
              ...
            </div>  
          </div>
        );
      }
    }
    `,
      errors: [
        {
          message: "there isn't an unobserve invoke for this.intersectionObserver with target this.intersectionElement",
        },
      ],
    },
  ],
});
