const { RuleTester } = require('eslint');
const createRule = require('../../../lib/rules/observers').createRule;
const RuleType = require('../../../lib/utils').RuleType;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
});

ruleTester.run('no-missing-unobserve-or-disconnect', createRule(RuleType.MatchingUnobserveTarget), {
  valid: [
/*     {
      code: `
    class MyComponent extends React.Component {
      resizeObserver = null;
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
        this.intersectionObserver.observe(this.targetNode);
      }
    
      componentWillUnmount() {
        if (this.resizeObserver) {
          this.resizeObserver.unobserve(this.resizeElement.current);
        }
        if (this.intersectionObserver) {
          this.intersectionObserver.unobserve(this.targetNode);
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
    }, */
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
          message: 'there isn\'t an unobserve invoke for this.resizeObserver with target this.targetNode',
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
          message: 'there isn\'t an unobserve invoke for this.resizeObserver with target this.resizeElement',
        },
      ],
    },
  ],
});
