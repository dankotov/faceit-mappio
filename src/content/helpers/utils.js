export const elementExistsIn = (selectorString, parent) => {
  if (parent === null) return false

  const exists = parent.querySelector(selectorString) === null ? false : true
  return exists
}