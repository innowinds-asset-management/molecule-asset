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


export function getTimestampString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}
