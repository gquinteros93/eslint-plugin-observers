import { Expression, MemberExpression, Super, Identifier } from "estree";

export enum RuleType {
  NoMissingUnobserveOrDisconnect = "no-missing-unobserve-or-disconnect",
  MatchingUnobserveTarget = "matching-unobserve-target",
}

export const isNewExpression = (node: Expression | Super): boolean => node?.type === "NewExpression";
export const isNodeIdentifier = (node: Expression | Super): boolean => node?.type === "Identifier";
export const isNodeMemberExpression = (node: Expression | Super): boolean => node?.type === "MemberExpression";
export const isNodeThisExpression = (node: Expression | Super): boolean => node?.type === "ThisExpression";
export const isNodeFunctionExpression = (node: Expression | Super): boolean => node?.type === "FunctionExpression";
export const isNodeArrowFunctionExpression = (node: Expression | Super): boolean =>
  node?.type === "ArrowFunctionExpression";

export const parseMemberExpression = (node: MemberExpression): string => {
  let value;

  if (isNodeIdentifier(node.object)) {
    value = (<Identifier>node.object).name;
  }

  if (isNodeMemberExpression(node.object)) {
    value = parseMemberExpression(<MemberExpression>node.object);
  }

  if (isNodeThisExpression(node.object)) {
    value = `this.${(<Identifier>node.property).name}`;
  }

  return value;
};

export const getDescription = (ruleName: RuleType): string => {
  switch (ruleName) {
    case RuleType.NoMissingUnobserveOrDisconnect:
      return "Missing disconnect or unobserve if observe exists";
    case RuleType.MatchingUnobserveTarget:
      return "Target for unobserve should match target observed previously";
  }
};
