# Migration Instructions for PO and POLineItem Schema Updates

## Schema Changes Applied:

### 1. Enhanced POStatus Enum
```prisma
enum POStatus {
  Draft
  PendingApproval
  Approved
  Issued
  PartiallyReceived
  FullyReceived
  Cancelled
  Closed
}
```

### 2. Updated PO Model
```prisma
model PO {
  id           String       @id @default(cuid())
  poNumber     String       @unique
  consumerId   String
  supplierId   String
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  status       POStatus    @default(Draft)
  totalAmount  Decimal     @db.Decimal(10,2) @default(0)
  grn          GRN[]
  poLineItem   POLineItem[]

  @@index([consumerId])
  @@index([supplierId])
  @@index([status])
  @@map("po")
}
```

### 3. Updated POLineItem Model
```prisma
model POLineItem {
  id                 String             @id @default(cuid())
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  grnId              String?
  partNo             String
  poId               String
  price              Decimal            @db.Decimal(10,2)
  quantity           Decimal            @db.Decimal(10,3)
  totalAmount        Decimal            @db.Decimal(10,2) @default(0)
  receivedQty        Decimal            @db.Decimal(10,3) @default(0)
  remainingQty       Decimal            @db.Decimal(10,3) @default(0)
  grnItem            GRNItem[]
  po                 PO                 @relation(fields: [poId], references: [id])

  @@index([poId], map: "purchaseItem_poId_fkey")
  @@index([partNo])
  @@index([receivedQty])
  @@map("poLineItem")
}
```

## Steps to Complete Migration:

### 1. Generate Prisma Client
Run one of these commands in PowerShell (as Administrator if needed):
```powershell
# Option 1: Using npx
npx prisma generate

# Option 2: Using npm script
npm run build:prisma

# Option 3: If execution policy is blocked, run in Command Prompt
cmd /c "npx prisma generate"
```

### 2. Create and Apply Migration
```powershell
# Create migration
npx prisma migrate dev --name "add_po_enhancements"

# Or if you want to apply to production
npx prisma migrate deploy
```

### 3. Update Existing Data (if any)
If you have existing PO data, you'll need to:
1. Generate PO numbers for existing records
2. Calculate total amounts
3. Update received quantities

### 4. Update Service Functions
The PO service has been updated with:
- Automatic PO number generation
- Total amount calculation
- Enhanced create/update functions
- New `updatePOTotalAmount` function

### 5. Update Controllers (if needed)
Make sure your controllers handle the new required fields and data types.

## Key Features Added:

1. **PO Number Generation**: Automatic unique PO numbers (PO-2024-001, PO-2024-002, etc.)
2. **Total Amount Tracking**: Calculated from line items
3. **Received Quantity Tracking**: Track partial and full receipts
4. **Enhanced Status Flow**: More granular status tracking
5. **Better Data Types**: Decimal for monetary values and quantities
6. **Performance Indexes**: Added indexes for common queries

## Usage Examples:

### Creating a PO:
```typescript
const newPO = await createPurchaseOrder({
  consumerId: "consumer_123",
  supplierId: "supplier_456",
  status: "Draft"
});
// poNumber will be auto-generated
```

### Adding Line Items:
```typescript
// After adding line items, update PO total
await updatePOTotalAmount(poId);
```

### Tracking Receipts:
```typescript
// Update received quantity when goods are received
await prisma.pOLineItem.update({
  where: { id: lineItemId },
  data: { 
    receivedQty: 5,
    remainingQty: 3 // quantity - receivedQty
  }
});
```
