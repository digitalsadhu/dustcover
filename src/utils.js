import _ from 'lodash'

export function firstDefined (...args) {
  for (const arg of args) {
    if (!_.isNil(arg)) return arg
  }
}
