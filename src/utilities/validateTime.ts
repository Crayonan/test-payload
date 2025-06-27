export const validateTime = (value: string | string[] | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (Array.isArray(value)) {
    return 'Invalid input type: Expected a single time string, not multiple values.'
  }
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timePattern.test(value) || 'Invalid time format. Use HH:mm.'
}
