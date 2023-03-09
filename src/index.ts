import { createRule } from './rules/observers'

import { RuleType } from './utils'

module.exports = {
  rules: {
    'no-missing-unobserve-or-disconnect': createRule(RuleType.NoMissingUnobserveOrDisconnect),
    'matching-unobserve-target': createRule(RuleType.MatchingUnobserveTarget),
  },
  configs: {
    recommended: {
      plugins: ['observers'],
      rules: {
        'no-missing-unobserve-or-disconnect': 'error',
        'matching-unobserve-target': 'error',
      },
    },
    strict: {
      plugins: ['observers'],
      rules: {
        'no-missing-unobserve-or-disconnect': 'error',
        'matching-unobserve-target': 'error',
      },
    },
  },
}
