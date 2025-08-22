// Inventory Transaction Types
export const INVENTORY_TRANSACTION_TYPES = {
  DEPT_EXPIRED_RETURN: 'DEPT-EXPIRED-RETURN',
  DEPT_GENERAL_RETURN: 'DEPT-GENERAL-RETURN',
  DEPT_OUT: 'DEPT-OUT',
  DISPOSED: 'DISPOSED',
  IN: 'IN',
  RESALE: 'RESALE',
  SUPPLIER_RETURN: 'SUPPLIER-RETURN'
} as const;

// Type for inventory transaction type codes
export type InventoryTransactionTypeCode = typeof INVENTORY_TRANSACTION_TYPES[keyof typeof INVENTORY_TRANSACTION_TYPES];

// Array of all transaction types for easy iteration
export const INVENTORY_TRANSACTION_TYPE_CODES = Object.values(INVENTORY_TRANSACTION_TYPES);

// Entity Names for ID Generation
export const ENTITY_NAMES = {
  SUPPLIER: 'SUP',
  SERVICE_REQUEST: 'SR',
  DEPARTMENT: 'DEPT',
  INVENTORY: 'INV'
} as const;

// Type for entity names
export type EntityName = typeof ENTITY_NAMES[keyof typeof ENTITY_NAMES];
