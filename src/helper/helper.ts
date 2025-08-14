export function validateQueryParams(query: Record<string, any>, allowedParams: string[]) {
  const queryKeys = Object.keys(query);
  const invalidParams = queryKeys.filter((key) => !allowedParams.includes(key));

  if (invalidParams.length > 0) {
    throw new Error(`Invalid query parameter(s): ${invalidParams.join(', ')}`);
  }
}


export function generateEntityId(entityName:string) {
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // ensures 10 digits
  return `${entityName}${randomNumber}`;
}