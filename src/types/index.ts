export type AssetType = {
  id: string;
  assetName: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  industryId: string;
  // Optionally, you can add these if you want nested types:
  // assets?: Asset[];
  // assetSubTypes?: AssetSubType[];
};


export type AssetSubType = {
  id: string;
  assetTypeId: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // assets?: Asset[];
  // assetType?: AssetType;
};

export type Asset = {
  id: string;
  assetTypeId: string;
  assetSubTypeId: string;
  assetName: string;
  warrantyPeriod?: number | null;
  warrantyStartDate?: Date | null;
  warrantyEndDate?: Date | null;
  installationDate?: Date | null;
  brand?: string | null;
  model?: string | null;
  subModel?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  consumerId: string;
  partNo?: string | null;
  supplierCode?: string | null;
  consumerSerialNo?: string | null;
  grnId?: string | null;
  grnItemId?: string | null;
  poLineItemId?: string | null;
  supplierId?: string | null;
  supplierSerialNo?: string | null;
  isAmc?: boolean;
  // Optionally, you can add these if you want nested types:
  // assetSubType?: AssetSubType;
  // assetType?: AssetType;
  // locations?: Location[];
  // installations?: Installation[];
  department?: Department[];
  warranties?: Warranty[];
};

export type Department = {
  deptId: string;
  deptName: string;
  consumerId: string;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // locations?: Location[];
  // installations?: Installation[];
};

export type Location = {
  id: string;
  assetId: string;
  departmentId: string;
  building?: string | null;
  floorNumber?: string | null;
  roomNumber?: string | null;
  isCurrentLocation: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // asset?: Asset;
  // department?: Department;
  // installations?: Installation[];
};

export type Installation = {  
  id: string;
  assetId: string;
  locationId: string;
  departmentId: string;
  installationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // asset?: Asset;
  // location?: Location;
  // department?: Department;
};

export type PO = {
  id: string;
  consumerId: string;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'Draft' | 'Issued' | 'Approved';
  // Optionally, you can add these if you want nested types:
  // grn?: GRN[];
  // poLineItem?: POLineItem[];
};

export type POLineItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  grnId?: string | null;
  partNo: string;
  poId: string;
  price: number;
  quantity: number;
  // Optionally, you can add these if you want nested types:
  // grnItem?: GRNItem[];
  // po?: PO;
};


export type GRN = {
  id: string;
  poId: string;
  dateTime: Date;
  challan?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // po?: PO;
  // grnItem?: GRNItem[];
};

export type GRNItem = {
  id: string;
  grnId: string;
  poLineItemId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Warranty Types
export type WarrantyType = {
  warrantyTypeId: number;
  typeName: string;
  description?: string | null;
  createdAt: Date;
  // Optionally, you can add these if you want nested types:
  // warranties?: Warranty[];
};

export type Warranty = {
  warrantyId: number;
  assetId: string;
  warrantyTypeId: number;
  warrantySupplierId?: string | null;
  warrantyNumber?: string | null;
  startDate: Date;
  endDate: Date;
  warrantyPeriod?: number | null;
  coverageType?: string | null;
  coverageDescription?: string | null;
  termsConditions?: string | null;
  cost?: number | null;
  isActive: boolean;
  autoRenewal: boolean;
  createdAt: Date;
  updatedAt: Date;
  consumerId?: number | null;
  supplierId?: number | null;
  // Optionally, you can add these if you want nested types:
  // warrantyType?: WarrantyType;
  // asset?: Asset;
  // notifications?: WarrantyNotification[];
};

export type WarrantyNotification = {
  notificationId: number;
  warrantyId: number;
  notificationType: 'Expiry_Warning' | 'Expired' | 'Renewal_Due' | 'Claim_Update';
  message: string;
  recipientEmail?: string | null;
  sentDate?: Date | null;
  isSent: boolean;
  createdAt: Date;
  // Optionally, you can add these if you want nested types:
  // warranty?: Warranty;
};

export type ConsumerPreference = {
  preferenceId: number;
  consumerId: number;
  notificationDays: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SupplierPreference = {
  preferenceId: number;
  supplierId: number;
  notificationDays: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ContractType = {
  contractTypeId: number;
  typeName: 'AMC' | 'CMC' | 'ON_CALL' | 'BREAKDOWN_MAINTENANCE';
  typeCode: string;
  description?: string | null;
  contractDurationMonths?: number | null;
  createdAt: Date;
  // Optionally, you can add these if you want nested types:
  // serviceContracts?: ServiceContract[];
};

export type ServiceContractStatus = {
  statusId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Optionally, you can add these if you want nested types:
  // serviceContracts?: ServiceContract[];
};

export type ServiceContract = {
  contractId: string;
  contractNumber: string;
  contractTypeId: number;
  serviceSupplierId: string;
  contractName: string;
  startDate: Date;
  endDate: Date;
  paymentTerms: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'ONE_TIME';
  coverageType: 'COMPREHENSIVE' | 'PARTS_ONLY' | 'LABOR_ONLY' | 'PREVENTIVE_ONLY';
  includes?: string | null;
  excludes?: string | null;
  serviceFrequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'AS_REQUIRED';
  preventiveMaintenanceIncluded: boolean;
  breakdownMaintenanceIncluded: boolean;
  autoRenewal: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  statusId?: number | null;
  // Optionally, you can add these if you want nested types:
  // contractType?: ContractType;
  // status?: ServiceContractStatus;
};

export type ServiceRequest = {
  serviceRequestId: string;
  assetId: string;
  technicianName: string;
  serviceSupplierId?: string | null;
  serviceContractId?: string | null;
  srNo?: string | null;
  warrantyStatus: 'ACTIVE' | 'EXPIRED' | 'VOID' | 'CLAIMED' | 'PENDING_CLAIM' | 'TRANSFERRED' | 'SUSPENDED' | 'NOT_APPLICABLE';
  serviceStatus?: string | null;
  serviceDate: Date;
  serviceType?: string | null;
  serviceDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  approverName?: string | null;
  // Optionally, you can add these if you want nested types:
  // serviceRequestItems?: ServiceRequestItem[];
};

export type ServiceRequestItem = {
  serviceRequestItemId: number;
  serviceRequestId: string;
  partName: string;
  partCost?: number | null;
  labourCost?: number | null;
  quantity?: number | null;
  totalCost?: number | null;
  defectDescription?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  // Optionally, you can add these if you want nested types:
  // serviceRequest?: ServiceRequest;
};

export type CreateAssetCompleteData = {
      assetTypeId: string;
      assetSubTypeId: string;
      assetName: string;
      warrantyPeriod?: number | null;
      warrantyStartDate?: Date | null;
      warrantyEndDate?: Date | null;
      installationDate?: Date | null;
      brand?: string | null;
      model?: string | null;
      subModel?: string | null;
      isActive?: boolean;
      consumerId: string;
      partNo?: string | null;
      supplierCode?: string | null;
      consumerSerialNo?: string | null;
      grnId?: string | null;
      grnItemId?: string | null;
      poLineItemId?: string | null;
      supplierId?: string | null;
      supplierSerialNo?: string | null;
      departmentId?: string;
      building?: string;
      isAmc?: boolean;
      floorNumber?: string;
      roomNumber?: string;
      isCurrentLocation?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
};