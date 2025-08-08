export function validateQueryParams(query: Record<string, any>, allowedParams: string[]) {
  const queryKeys = Object.keys(query);
  const invalidParams = queryKeys.filter((key) => !allowedParams.includes(key));

  if (invalidParams.length > 0) {
    throw new Error(`Invalid query parameter(s): ${invalidParams.join(', ')}`);
  }
}
