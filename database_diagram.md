# Asset Management Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    AssetType {
        string id PK
        string industryId
        string assetName
        string code UK
        string description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    AssetSubType {
        string id PK
        string assetTypeId FK
        string name
        string code UK
        string description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Asset {
        string id PK
        string assetTypeId FK
        string assetSubTypeId FK
        string assetName
        string consumerId
        string partNo
        string supplierId
        string supplierSerialNo
        string consumerSerialNo
        string poLineItemId
        string goodsReceivedId
        string goodsReceivedItemId
        int warrantyPeriod
        datetime warrantyStartDate
        datetime warrantyEndDate
        string warrantyId
        datetime installationDate
        string brand
        string model
        string subModel
        string supplierCode
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Installation {
        string id PK
        string assetId FK
        string building
        string departmentName
        string floorNumber
        string roomNumber
    }

    PO {
        string id PK
        string supplierId
        string supplierName
        datetime createdAt
        datetime updatedAt
    }

    POLineItem {
        string id PK
        string poId FK
        string partNo
        float price
        float quantity
        string grnId
        enum purchaseItemStatus
        datetime createdAt
        datetime updatedAt
    }

    GRN {
        string id PK
        string poId FK
        datetime dateTime
        string challan
        datetime createdAt
        datetime updatedAt
    }

    GRNItem {
        string id PK
        string grnId FK
        string poLineItemId FK
        datetime createdAt
        datetime updatedAt
    }

    %% Relationships
    AssetType ||--o{ AssetSubType : "has"
    AssetType ||--o{ Asset : "has"
    AssetSubType ||--o{ Asset : "has"
    Asset ||--o{ Installation : "has"
    PO ||--o{ POLineItem : "contains"
    PO ||--o{ GRN : "generates"
    GRN ||--o{ GRNItem : "contains"
    POLineItem ||--o{ GRNItem : "receives"
```

## Database Schema Overview

### Core Asset Management
- **AssetType**: Defines categories of assets with industry classification
- **AssetSubType**: Subcategories within asset types
- **Asset**: Individual asset records with detailed information
- **Installation**: Location and installation details for assets

### Purchase Management
- **PO**: Purchase orders with supplier information
- **POLineItem**: Individual line items within purchase orders
- **GRN**: Goods Received Notifications
- **GRNItem**: Individual items in received goods notifications

### Key Features
- Hierarchical asset classification (Type → SubType → Asset)
- Separate installation tracking for asset locations
- Purchase order workflow with status tracking
- Goods received notification system
- Comprehensive asset tracking with warranty information
- Audit trail with created/updated timestamps

### Status Enums
- **PurchaseItemStatus**: RECEIVED, APPROVED, REJECTED

### Workflow
1. **Asset Classification**: AssetType → AssetSubType → Asset
2. **Asset Installation**: Asset → Installation (location details)
3. **Purchase Process**: PO → POLineItem → GRN → GRNItem
4. **Asset Tracking**: Assets can reference PO line items and GRN items

### Key Relationships
- **AssetType** → **AssetSubType** (One-to-Many)
- **AssetType** → **Asset** (One-to-Many)
- **AssetSubType** → **Asset** (One-to-Many)
- **Asset** → **Installation** (One-to-Many)
- **PO** → **POLineItem** (One-to-Many)
- **PO** → **GRN** (One-to-Many)
- **GRN** → **GRNItem** (One-to-Many)
- **POLineItem** → **GRNItem** (One-to-Many) 