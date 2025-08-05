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
  warrantyId?: string | null;
  consumerSerialNo?: string | null;
  grnId?: string | null;
  grnItemId?: string | null;
  poLineItemId?: string | null;
  supplierId?: string | null;
  supplierSerialNo?: string | null;
  // Optionally, you can add these if you want nested types:
  // assetSubType?: AssetSubType;
  // assetType?: AssetType;
  // locations?: Location[];
  // installations?: Installation[];
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
      warrantyId?: string | null;
      consumerSerialNo?: string | null;
      grnId?: string | null;
      grnItemId?: string | null;
      poLineItemId?: string | null;
      supplierId?: string | null;
      supplierSerialNo?: string | null;
      departmentId?: string;
      building?: string;
      floorNumber?: string;
      roomNumber?: string;
      isCurrentLocation?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
};