import { Rule } from 'eslint';
import { BaseCallExpression, Expression, MemberExpression, Identifier, SourceLocation } from 'estree';
import { isNodeMemberExpression, isNodeIdentifier, parseMemberExpression, RuleType, getDescription } from '../utils';
import merge = require("lodash/merge")

enum MethodsType {
  OBSERVE = 'observe',
  UNOBSERVE = 'unobserve',
  DISCONNECT = 'disconnect',
}

interface ObservedElements {
  [key: string]: {
    [target: string]: {
      loc: SourceLocation;
    };
  };
}

interface Methods {
  [MethodsType.OBSERVE]?: ObservedElements;
  [MethodsType.UNOBSERVE]?: ObservedElements;
  [MethodsType.DISCONNECT]?: ObservedElements;
}

const reportMissingUnobserveOrDisconnect = ({
  context,
  element,
  loc,
}: {
  context: Rule.RuleContext;
  element: string;
  loc: SourceLocation;
}) => {
  context.report({
    loc,
    message: `${element} does not have a corresponding Unobserve or Disconnnect`,
  });
};

const reportNoMatchingUnobserveTarget = ({
  context,
  element,
  targetObserve,
  loc,
}: {
  context: Rule.RuleContext;
  element: string;
  targetObserve: string;
  loc: SourceLocation;
}) => {
  context.report({
    loc,
    message: `there isn't an unobserve invoke for ${element} with target ${targetObserve}`,
  });
};

const callExpressionListener = (methods: Methods) => (node: BaseCallExpression) => {
  if (isNodeMemberExpression(node.callee)) {
    const callee: MemberExpression = <MemberExpression>node.callee;
    const methodsType = (<Identifier>callee.property)?.name as MethodsType;

    if ([MethodsType.OBSERVE, MethodsType.UNOBSERVE].includes(methodsType) && node.arguments.length) {
      const element = parseMemberExpression(callee);
      const argument = <Expression>node.arguments[0];
      let target: string;

      if (isNodeIdentifier(argument)) {
        target = (<Identifier>argument).name;
      } else {
        target = parseMemberExpression(<MemberExpression>argument);
      }

      const currentMethods = methods[<MethodsType>methodsType] || {};
      methods[<MethodsType>methodsType] = merge(currentMethods, {
        [element]: {
          [target]: {
            loc: node.loc,
          },
        },
      });
    } else if ([MethodsType.DISCONNECT].includes(methodsType)) {
      const element = parseMemberExpression(callee);

      const currentMethods = methods[<MethodsType>methodsType] || {};
      methods[<MethodsType>methodsType] = merge(currentMethods, {
        [element]: {
          [MethodsType.DISCONNECT]: {
            loc: node.loc,
          },
        },
      });
    }
  }
};

const programListener = (ruleName: RuleType, methods: Methods, context: Rule.RuleContext) => () => {
  const observeMethods = methods[MethodsType.OBSERVE] ?? {};
  const unobserveMethods = methods[MethodsType.UNOBSERVE] ?? {};
  const disconnectMethods = methods[MethodsType.DISCONNECT] ?? {};

  Object.keys(observeMethods).forEach((element) => {
    const observed = observeMethods[element];
    const unobserved = unobserveMethods[element];
    const disconnected = disconnectMethods[element];

    Object.entries(observed).forEach(([target, { loc }]) => {
      switch (ruleName) {
        case RuleType.NoMissingUnobserveOrDisconnect:
          if (!unobserved && !disconnected) {
            reportMissingUnobserveOrDisconnect({ context, element, loc });
          }
          break;

        case RuleType.MatchingUnobserveTarget:
          if (unobserved && !unobserved[target]) {
            reportNoMatchingUnobserveTarget({ context, element, targetObserve: target, loc });
          }
          break;
      }
    });
  });
};

export const createRule = (ruleName: RuleType): Rule.RuleModule => ({
  meta: {
    docs: {
      description: getDescription(ruleName),
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    schema: [],
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const methods: Methods = {};

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'CallExpression:exit': callExpressionListener(methods),
      'Program:exit': programListener(ruleName, methods, context),
    };
  },
});
