import { Rule } from 'eslint';
import {
  BaseCallExpression,
  Expression,
  MemberExpression,
  Identifier,
  SourceLocation,
  VariableDeclarator,
  NewExpression,
  AssignmentExpression,
} from 'estree';
import {
  isNodeMemberExpression,
  isNodeIdentifier,
  parseMemberExpression,
  RuleType,
  getDescription,
  isNewExpression,
} from '../utils';
import merge = require('lodash/merge');

enum ObserversTypes {
  MutationObserver = 'MutationObserver',
  ResizeObserver = 'ResizeObserver',
  IntersectionObserver = 'IntersectionObserver',
}

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

interface NewObservers {
  [key: string]: {
    loc: SourceLocation;
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

const isNewObserver = (node: Expression): boolean => {
  const newExpression: NewExpression = <NewExpression>node;
  const identifier: Identifier = <Identifier>newExpression.callee;
  const observerType = identifier?.name as ObserversTypes;
  return [ObserversTypes.MutationObserver, ObserversTypes.IntersectionObserver, ObserversTypes.ResizeObserver].includes(
    observerType
  );
};

const assignmentExpressionListener = (newObservers: NewObservers) => (node: AssignmentExpression) => {
  if (isNewExpression(node.right) && isNewObserver(node.right)) {
    const left: MemberExpression = <MemberExpression>node.left;
    const name = (<Identifier>left.property)?.name;
    if(name) {
      newObservers[name] = {
        loc: node.loc,
      };
    }
  }
};

const variableDeclaratorListener = (newObservers: NewObservers) => (node: VariableDeclarator) => {
  if (node?.init && isNewExpression(node?.init) && isNewObserver(node?.init)) {
    const variable: Identifier = <Identifier>node.id;
    newObservers[variable.name] = {
      loc: variable.loc,
    };
  }
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

  // console.log('GHOLA HOLA HOAL HOAL HOAL HOAL HOOA');

  // console.log('1111 1111 1 11 1 1 1  1 1 1 1  11 ');
  // console.log(observeMethods);
  // console.log('2222 2 22 22 2 2 2 2 2 2 2 2  ');
  // console.log(unobserveMethods);
  // console.log('33 3 3 3 3 33 3 3 3 3 3 3 33 ');
  // console.log(disconnectMethods);
  // console.log('CHAU CHAU CHUA CHUA CHUA CHAU');

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
    const newObservers: NewObservers = {};
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'VariableDeclarator:exit': variableDeclaratorListener(newObservers),
      'AssignmentExpression:exit': assignmentExpressionListener(newObservers),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'CallExpression:exit': callExpressionListener(methods),
      'Program:exit': programListener(ruleName, methods, context),
    };
  },
});
