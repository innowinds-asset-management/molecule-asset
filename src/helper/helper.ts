export function validateQueryParams(query: Record<string, any>, allowedParams: string[]) {
  const queryKeys = Object.keys(query);
  const invalidParams = queryKeys.filter((key) => !allowedParams.includes(key));

  if (invalidParams.length > 0) {
    throw new Error(`Invalid query parameter(s): ${invalidParams.join(', ')}`);
  }
}


export function generateEntityId(entityName: string) {
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // ensures 5 digits
  return `${entityName}-${randomNumber}`;
}


