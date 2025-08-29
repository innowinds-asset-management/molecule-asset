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

// Service Request Status Codes
export const SERVICE_REQUEST_STATUS = {
  CANCELLED: 'CANCELLED',
  CLOSED: 'CLOSED',
  COMPLETED: 'COMPLETED',
  INPROGRESS: 'INPROGRESS',
  OPEN: 'OPEN',
  PENDING: 'PENDING',
} as const;

// Type for service request status codes
export type ServiceRequestStatusCode = typeof SERVICE_REQUEST_STATUS[keyof typeof SERVICE_REQUEST_STATUS];

// Array of all status codes for easy iteration
export const SERVICE_REQUEST_STATUS_CODES: ServiceRequestStatusCode[] = [
  SERVICE_REQUEST_STATUS.CANCELLED,
  SERVICE_REQUEST_STATUS.CLOSED,
  SERVICE_REQUEST_STATUS.COMPLETED,
  SERVICE_REQUEST_STATUS.INPROGRESS,
  SERVICE_REQUEST_STATUS.OPEN,
  SERVICE_REQUEST_STATUS.PENDING,
];

// Display names for each status code
export const SERVICE_REQUEST_STATUS_DISPLAY_NAMES = {
  [SERVICE_REQUEST_STATUS.CANCELLED]: 'Cancelled',
  [SERVICE_REQUEST_STATUS.CLOSED]: 'Closed',
  [SERVICE_REQUEST_STATUS.COMPLETED]: 'Completed',
  [SERVICE_REQUEST_STATUS.INPROGRESS]: 'In Progress',
  [SERVICE_REQUEST_STATUS.OPEN]: 'Open',
  [SERVICE_REQUEST_STATUS.PENDING]: 'Pending',
} as const;

// Entity Names for ID Generation
export const ENTITY_NAMES = {
  SUPPLIER: 'SUP',
  SERVICE_REQUEST: 'SR',
  DEPARTMENT: 'DEPT',
  INVENTORY: 'INV'
} as const;

// Type for entity names
export type EntityName = typeof ENTITY_NAMES[keyof typeof ENTITY_NAMES];
