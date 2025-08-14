/**
 * Generates a unique entity ID by combining the entity name with a random 10-digit number
 * @param entityName - The name of the entity (e.g., 'ASSET', 'SUPPLIER', 'SR')
 * @returns A unique entity ID string
 */
export function generateEntityId(entityName: string): string {
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // ensures 10 digits
  return `${entityName}${randomNumber}`;
}
