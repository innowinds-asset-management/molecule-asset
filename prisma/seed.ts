import { PrismaClient, POStatus, ContractTypeName, PaymentTerms, CoverageType, ServiceFrequency } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data in reverse dependency order
  console.log('🧹 Clearing existing data...')
  await prisma.serviceRequestItem.deleteMany()
  await prisma.serviceRequest.deleteMany()
  await prisma.serviceContract.deleteMany()
  await prisma.warrantyNotification.deleteMany()
  await prisma.warranties.deleteMany()
  await prisma.warrantyType.deleteMany()
  await prisma.installation.deleteMany()
  await prisma.location.deleteMany()
  await prisma.gRNItem.deleteMany()
  await prisma.gRN.deleteMany()
  await prisma.pOLineItem.deleteMany()
  await prisma.pO.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.assetSubType.deleteMany()
  await prisma.assetType.deleteMany()
  await prisma.department.deleteMany()
  await prisma.consumerSupplier.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.consumer.deleteMany()
  await prisma.contractType.deleteMany()
  await prisma.serviceContractStatus.deleteMany()
  await prisma.consumerPreference.deleteMany()
  await prisma.supplierPreference.deleteMany()

  console.log('✅ Cleared existing data')

  // Create Consumers
  console.log('👥 Creating Consumers...')
  const consumers = await Promise.all([
    prisma.consumer.create({
      data: {
        name: 'TechCorp Solutions',
        code: 'TECH001',
        contactName: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0101',
        address: '123 Tech Street, Silicon Valley, CA 94025',
        isActive: true,
      },
    }),
    prisma.consumer.create({
      data: {
        name: 'Healthcare Systems Inc',
        code: 'HEALTH001',
        contactName: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@healthcare.com',
        phone: '+1-555-0202',
        address: '456 Medical Center Dr, Boston, MA 02115',
        isActive: true,
      },
    }),
    prisma.consumer.create({
      data: {
        name: 'Manufacturing Plus',
        code: 'MFG001',
        contactName: 'Mike Chen',
        email: 'mike.chen@mfgplus.com',
        phone: '+1-555-0303',
        address: '789 Industrial Blvd, Detroit, MI 48201',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created Consumers')

  // Create Suppliers
  console.log('🏭 Creating Suppliers...')
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Dell Technologies',
        code: 'DELL001',
        gstNumber: 'GST123456789',
        email: 'sales@dell.com',
        phone: '+1-800-DELL-123',
        address: 'One Dell Way, Round Rock, TX 78682',
        isActive: true,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'HP Inc',
        code: 'HP001',
        gstNumber: 'GST987654321',
        email: 'sales@hp.com',
        phone: '+1-800-HP-456',
        address: '1501 Page Mill Road, Palo Alto, CA 94304',
        isActive: true,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Apple Inc',
        code: 'APPLE001',
        gstNumber: 'GST456789123',
        email: 'sales@apple.com',
        phone: '+1-800-APPLE-789',
        address: '1 Apple Park Way, Cupertino, CA 95014',
        isActive: true,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Siemens Healthcare',
        code: 'SIEMENS001',
        gstNumber: 'GST789123456',
        email: 'healthcare@siemens.com',
        phone: '+1-800-SIEMENS',
        address: '40 Liberty Boulevard, Malvern, PA 19355',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created Suppliers')

  // Create Consumer-Supplier relationships
  console.log('🤝 Creating Consumer-Supplier relationships...')
  await Promise.all([
    prisma.consumerSupplier.create({
      data: {
        consumerId: consumers[0].id,
        supplierId: suppliers[0].id, // TechCorp - Dell
      },
    }),
    prisma.consumerSupplier.create({
      data: {
        consumerId: consumers[0].id,
        supplierId: suppliers[1].id, // TechCorp - HP
      },
    }),
    prisma.consumerSupplier.create({
      data: {
        consumerId: consumers[1].id,
        supplierId: suppliers[3].id, // Healthcare - Siemens
      },
    }),
    prisma.consumerSupplier.create({
      data: {
        consumerId: consumers[2].id,
        supplierId: suppliers[0].id, // Manufacturing - Dell
      },
    }),
  ])

  console.log('✅ Created Consumer-Supplier relationships')

  // Create AssetTypes
  console.log('📦 Creating Asset Types...')
  const assetTypes = await Promise.all([
    prisma.assetType.create({
      data: {
        assetName: 'IT Equipment',
        code: 'IT',
        description: 'Information Technology equipment and devices',
        isActive: true,
        industryId: 'tech',
      },
    }),
    prisma.assetType.create({
      data: {
        assetName: 'Medical Devices',
        code: 'MED',
        description: 'Medical and healthcare equipment',
        isActive: true,
        industryId: 'healthcare',
      },
    }),
    prisma.assetType.create({
      data: {
        assetName: 'Manufacturing Equipment',
        code: 'MFG',
        description: 'Industrial and manufacturing equipment',
        isActive: true,
        industryId: 'manufacturing',
      },
    }),
    prisma.assetType.create({
      data: {
        assetName: 'Office Equipment',
        code: 'OFFICE',
        description: 'Office furniture and equipment',
        isActive: true,
        industryId: 'office',
      },
    }),
  ])

  console.log('✅ Created Asset Types')

  // Create AssetSubTypes
  console.log('🔧 Creating Asset Sub Types...')
  const assetSubTypes = await Promise.all([
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // IT Equipment
        name: 'Laptops',
        code: 'LAPTOP',
        description: 'Portable computers and laptops',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // IT Equipment
        name: 'Servers',
        code: 'SERVER',
        description: 'Server hardware and networking equipment',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // IT Equipment
        name: 'Printers',
        code: 'PRINTER',
        description: 'Printing and scanning equipment',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[1].id, // Medical Devices
        name: 'Imaging Equipment',
        code: 'IMAGING',
        description: 'Medical imaging devices',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[1].id, // Medical Devices
        name: 'Monitoring Equipment',
        code: 'MONITORING',
        description: 'Patient monitoring devices',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[2].id, // Manufacturing Equipment
        name: 'CNC Machines',
        code: 'CNC',
        description: 'Computer Numerical Control machines',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[3].id, // Office Equipment
        name: 'Desks',
        code: 'DESK',
        description: 'Office desks and workstations',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created Asset Sub Types')

  // Create Departments
  console.log('🏢 Creating Departments...')
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        deptName: 'IT Department',
        consumerId: consumers[0].id,
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Radiology Department',
        consumerId: consumers[1].id,
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Production Department',
        consumerId: consumers[2].id,
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Administration',
        consumerId: consumers[0].id,
      },
    }),
  ])

  console.log('✅ Created Departments')

  // Create Contract Types
  console.log('📋 Creating Contract Types...')
  const contractTypes = await Promise.all([
    prisma.contractType.create({
      data: {
        typeName: ContractTypeName.AMC,
        typeCode: 'AMC',
        description: 'Annual Maintenance Contract',
        contractDurationMonths: 12,
      },
    }),
    prisma.contractType.create({
      data: {
        typeName: ContractTypeName.CMC,
        typeCode: 'CMC',
        description: 'Comprehensive Maintenance Contract',
        contractDurationMonths: 12,
      },
    }),
    prisma.contractType.create({
      data: {
        typeName: ContractTypeName.ON_CALL,
        typeCode: 'ONC',
        description: 'On-call support services',
        contractDurationMonths: null,
      },
    }),
  ])

  console.log('✅ Created Contract Types')

  // Create Service Contract Status
  console.log('📊 Creating Service Contract Status...')
  const serviceContractStatuses = await Promise.all([
    prisma.serviceContractStatus.create({
      data: {
        name: 'Draft',
      },
    }),
    prisma.serviceContractStatus.create({
      data: {
        name: 'Active',
      },
    }),
    prisma.serviceContractStatus.create({
      data: {
        name: 'Expired',
      },
    }),
    prisma.serviceContractStatus.create({
      data: {
        name: 'Terminated',
      },
    }),
  ])

  console.log('✅ Created Service Contract Status')

  // Create Warranty Types
  console.log('🛡️ Creating Warranty Types...')
  const warrantyTypes = await Promise.all([
    prisma.warrantyType.create({
      data: {
        typeName: 'Manufacturer Warranty',
        description: 'Original equipment manufacturer warranty',
        consumerId: consumers[0].id,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.warrantyType.create({
      data: {
        typeName: 'Extended Warranty',
        description: 'Extended warranty purchased separately',
        consumerId: consumers[1].id,
        supplierId: suppliers[3].id,
      },
    }),
    prisma.warrantyType.create({
      data: {
        typeName: 'Service Contract',
        description: 'Warranty through service provider',
        consumerId: consumers[2].id,
        supplierId: suppliers[0].id,
      },
    }),
  ])

  console.log('✅ Created Warranty Types')

  // Create Purchase Orders
  console.log('📦 Creating Purchase Orders...')
  const purchaseOrders = await Promise.all([
    prisma.pO.create({
      data: {
        poNumber: 'PO-2024-001',
        consumerId: consumers[0].id,
        supplierId: suppliers[0].id,
        status: POStatus.Approved,
        totalAmount: 15000.00,
      },
    }),
    prisma.pO.create({
      data: {
        poNumber: 'PO-2024-002',
        consumerId: consumers[1].id,
        supplierId: suppliers[3].id,
        status: POStatus.Approved,
        totalAmount: 25000.00,
      },
    }),
    prisma.pO.create({
      data: {
        poNumber: 'PO-2024-003',
        consumerId: consumers[2].id,
        supplierId: suppliers[0].id,
        status: POStatus.Approved,
        totalAmount: 35000.00,
      },
    }),
  ])

  console.log('✅ Created Purchase Orders')

  // Create PO Line Items
  console.log('📋 Creating PO Line Items...')
  const poLineItems = await Promise.all([
    prisma.pOLineItem.create({
      data: {
        poId: purchaseOrders[0].id,
        itemName: 'Dell Latitude 7490 Laptop',
        partNo: 'DL7490-001',
        price: 1299.99,
        quantity: 10,
        totalAmount: 12999.90,
        receivedQty: 10,
        remainingQty: 0,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: purchaseOrders[1].id,
        itemName: 'Siemens CT Scanner',
        partNo: 'SIEMENS-CT-001',
        price: 25000.00,
        quantity: 1,
        totalAmount: 25000.00,
        receivedQty: 1,
        remainingQty: 0,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: purchaseOrders[2].id,
        itemName: 'Dell PowerEdge R740 Server',
        partNo: 'DELL-R740-001',
        price: 3500.00,
        quantity: 10,
        totalAmount: 35000.00,
        receivedQty: 10,
        remainingQty: 0,
      },
    }),
  ])

  console.log('✅ Created PO Line Items')

  // Create GRNs
  console.log('📦 Creating GRNs...')
  const grns = await Promise.all([
    prisma.gRN.create({
      data: {
        poId: purchaseOrders[0].id,
        grnNo: 'GRN-2024-001',
        challan: 'CH-001-2024',
        deliveryNote: 'DN-001-2024',
        deliveryDate: new Date('2024-01-15'),
        driverName: 'John Driver',
        receivedBy: 'Jane Receiver',
        vehicleNumber: 'ABC-123',
      },
    }),
    prisma.gRN.create({
      data: {
        poId: purchaseOrders[1].id,
        grnNo: 'GRN-2024-002',
        challan: 'CH-002-2024',
        deliveryNote: 'DN-002-2024',
        deliveryDate: new Date('2024-02-01'),
        driverName: 'Mike Driver',
        receivedBy: 'Dr. Sarah Johnson',
        vehicleNumber: 'XYZ-789',
      },
    }),
    prisma.gRN.create({
      data: {
        poId: purchaseOrders[2].id,
        grnNo: 'GRN-2024-003',
        challan: 'CH-003-2024',
        deliveryNote: 'DN-003-2024',
        deliveryDate: new Date('2024-03-01'),
        driverName: 'Alex Driver',
        receivedBy: 'Mike Chen',
        vehicleNumber: 'DEF-456',
      },
    }),
  ])

  console.log('✅ Created GRNs')

  // Create GRN Items
  console.log('📋 Creating GRN Items...')
  const grnItems = await Promise.all([
    prisma.gRNItem.create({
      data: {
        grnId: grns[0].id,
        poLineItemId: poLineItems[0].id,
        quantityOrdered: 10,
        quantityReceived: 10,
        quantityAccepted: 10,
        quantityRejected: 0,
        quantityRemaining: 0,
        remarks: 'All items received in good condition',
      },
    }),
    prisma.gRNItem.create({
      data: {
        grnId: grns[1].id,
        poLineItemId: poLineItems[1].id,
        quantityOrdered: 1,
        quantityReceived: 1,
        quantityAccepted: 1,
        quantityRejected: 0,
        quantityRemaining: 0,
        remarks: 'Medical equipment received and tested',
      },
    }),
    prisma.gRNItem.create({
      data: {
        grnId: grns[2].id,
        poLineItemId: poLineItems[2].id,
        quantityOrdered: 10,
        quantityReceived: 10,
        quantityAccepted: 10,
        quantityRejected: 0,
        quantityRemaining: 0,
        remarks: 'All servers received and functional',
      },
    }),
  ])

  console.log('✅ Created GRN Items')

  // Create Assets
  console.log('💻 Creating Assets...')
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[0].id, // IT Equipment
        assetSubTypeId: assetSubTypes[0].id, // Laptops
        assetName: 'Dell Latitude 7490 Laptop',
        warrantyPeriod: 36,
        warrantyStartDate: new Date('2024-01-15'),
        warrantyEndDate: new Date('2027-01-15'),
        installationDate: new Date('2024-01-20'),
        brand: 'Dell',
        model: 'Latitude 7490',
        subModel: 'i7-8650U',
        isActive: true,
        consumerId: consumers[0].id,
        partNo: 'DL7490-001',
        supplierCode: 'DELL-LAT-7490',
        isAmc: true,
        consumerSerialNo: 'CSN-IT-001',
        departmentId: departments[0].deptId, // IT Department
        grnId: grns[0].id,
        grnItemId: grnItems[0].id,
        poLineItemId: poLineItems[0].id,
        supplierId: suppliers[0].id,
        supplierSerialNo: 'SN-DL7490-001',
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[1].id, // Medical Devices
        assetSubTypeId: assetSubTypes[3].id, // Imaging Equipment
        assetName: 'Siemens CT Scanner',
        warrantyPeriod: 60,
        warrantyStartDate: new Date('2024-02-01'),
        warrantyEndDate: new Date('2029-02-01'),
        installationDate: new Date('2024-02-05'),
        brand: 'Siemens',
        model: 'SOMATOM Perspective',
        subModel: '64-slice',
        isActive: true,
        consumerId: consumers[1].id,
        partNo: 'SIEMENS-CT-001',
        supplierCode: 'SIEMENS-SOMATOM',
        isAmc: true,
        consumerSerialNo: 'CSN-MED-001',
        departmentId: departments[1].deptId, // Radiology Department
        grnId: grns[1].id,
        grnItemId: grnItems[1].id,
        poLineItemId: poLineItems[1].id,
        supplierId: suppliers[3].id,
        supplierSerialNo: 'SN-SIEMENS-CT-001',
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[0].id, // IT Equipment
        assetSubTypeId: assetSubTypes[1].id, // Servers
        assetName: 'Dell PowerEdge R740 Server',
        warrantyPeriod: 48,
        warrantyStartDate: new Date('2024-03-01'),
        warrantyEndDate: new Date('2028-03-01'),
        installationDate: new Date('2024-03-05'),
        brand: 'Dell',
        model: 'PowerEdge R740',
        subModel: '2U Rack Server',
        isActive: true,
        consumerId: consumers[2].id,
        partNo: 'DELL-R740-001',
        supplierCode: 'DELL-PE-R740',
        isAmc: true,
        consumerSerialNo: 'CSN-MFG-001',
        departmentId: departments[2].deptId, // Production Department
        grnId: grns[2].id,
        grnItemId: grnItems[2].id,
        poLineItemId: poLineItems[2].id,
        supplierId: suppliers[0].id,
        supplierSerialNo: 'SN-DELL-R740-001',
      },
    }),
  ])

  console.log('✅ Created Assets')

  // Create Locations
  console.log('📍 Creating Locations...')
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        assetId: assets[0].id,
        departmentId: departments[0].deptId, // IT Department
        building: 'Building A',
        floorNumber: '2',
        roomNumber: '201',
        isCurrentLocation: true,
      },
    }),
    prisma.location.create({
      data: {
        assetId: assets[1].id,
        departmentId: departments[1].deptId, // Radiology Department
        building: 'Medical Center',
        floorNumber: '1',
        roomNumber: 'RAD-01',
        isCurrentLocation: true,
      },
    }),
    prisma.location.create({
      data: {
        assetId: assets[2].id,
        departmentId: departments[2].deptId, // Production Department
        building: 'Factory Building',
        floorNumber: '1',
        roomNumber: 'SERVER-01',
        isCurrentLocation: true,
      },
    }),
  ])

  console.log('✅ Created Locations')

  // Create Installations
  console.log('🔧 Creating Installations...')
  const installations = await Promise.all([
    prisma.installation.create({
      data: {
        assetId: assets[0].id,
        locationId: locations[0].id,
        departmentId: departments[0].deptId,
        installationDate: new Date('2024-01-20'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[1].id,
        locationId: locations[1].id,
        departmentId: departments[1].deptId,
        installationDate: new Date('2024-02-05'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[2].id,
        locationId: locations[2].id,
        departmentId: departments[2].deptId,
        installationDate: new Date('2024-03-05'),
      },
    }),
  ])

  console.log('✅ Created Installations')

  // Create Warranties
  console.log('🛡️ Creating Warranties...')
  const warranties = await Promise.all([
    prisma.warranties.create({
      data: {
        assetId: assets[0].id,
        warrantyTypeId: warrantyTypes[0].warrantyTypeId,
        warrantyNumber: 'WARR-2024-001',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2027-01-15'),
        warrantyPeriod: 36,
        coverageType: 'Hardware and Software',
        coverageDescription: 'Full hardware and software warranty coverage',
        termsConditions: 'Standard warranty terms apply',
        cost: 1299.99,
        isActive: true,
        autoRenewal: false,
        consumerId: consumers[0].id,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.warranties.create({
      data: {
        assetId: assets[1].id,
        warrantyTypeId: warrantyTypes[1].warrantyTypeId,
        warrantyNumber: 'WARR-2024-002',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2029-02-01'),
        warrantyPeriod: 60,
        coverageType: 'Comprehensive Medical Equipment',
        coverageDescription: 'Full medical equipment warranty with service',
        termsConditions: 'Medical equipment warranty terms',
        cost: 25000.00,
        isActive: true,
        autoRenewal: true,
        consumerId: consumers[1].id,
        supplierId: suppliers[3].id,
      },
    }),
  ])

  console.log('✅ Created Warranties')

  // Create Service Contracts
  console.log('📋 Creating Service Contracts...')
  const serviceContracts = await Promise.all([
    prisma.serviceContract.create({
      data: {
        contractNumber: 'SC-2024-001',
        contractTypeId: contractTypes[0].contractTypeId,
        serviceSupplierId: suppliers[0].id,
        assetId: assets[0].id,
        contractName: 'Dell Latitude 7490 AMC',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-15'),
        paymentTerms: PaymentTerms.YEARLY,
        coverageType: CoverageType.COMPREHENSIVE,
        includes: 'Hardware maintenance, software updates, on-site support',
        excludes: 'Accidental damage, user negligence',
        serviceFrequency: ServiceFrequency.QUARTERLY,
        preventiveMaintenanceIncluded: true,
        breakdownMaintenanceIncluded: true,
        autoRenewal: true,
        createdBy: 'John Smith',
        statusId: serviceContractStatuses[1].statusId, // Active
      },
    }),
    prisma.serviceContract.create({
      data: {
        contractNumber: 'SC-2024-002',
        contractTypeId: contractTypes[1].contractTypeId,
        serviceSupplierId: suppliers[3].id,
        assetId: assets[1].id,
        contractName: 'Siemens CT Scanner CMC',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-02-01'),
        paymentTerms: PaymentTerms.YEARLY,
        coverageType: CoverageType.COMPREHENSIVE,
        includes: 'Full medical equipment maintenance, calibration, emergency support',
        excludes: 'Consumables, user training',
        serviceFrequency: ServiceFrequency.MONTHLY,
        preventiveMaintenanceIncluded: true,
        breakdownMaintenanceIncluded: true,
        autoRenewal: true,
        createdBy: 'Dr. Sarah Johnson',
        statusId: serviceContractStatuses[1].statusId, // Active
      },
    }),
  ])

  console.log('✅ Created Service Contracts')

  // Create Service Requests
  console.log('🔧 Creating Service Requests...')
  const serviceRequests = await Promise.all([
    prisma.serviceRequest.create({
      data: {
        assetId: assets[0].id,
        technicianName: 'Mike Technician',
        serviceSupplierId: suppliers[0].id,
        serviceContractId: serviceContracts[0].contractId,
        srStatus: 'In Progress',
        srNo: 'SR-2024-001',
        serviceDate: new Date('2024-06-15'),
        serviceType: 'Preventive Maintenance',
        serviceDescription: 'Quarterly preventive maintenance check',
        assetCondition: 'Working',
        problem: 'Routine maintenance required',
        approverName: 'John Smith',
        totalCost: 0.00, // Covered under contract
        warrantyId: warranties[0].warrantyId,
      },
    }),
    prisma.serviceRequest.create({
      data: {
        assetId: assets[1].id,
        technicianName: 'Dr. Tech Specialist',
        serviceSupplierId: suppliers[3].id,
        serviceContractId: serviceContracts[1].contractId,
        srStatus: 'Completed',
        srNo: 'SR-2024-002',
        serviceDate: new Date('2024-06-10'),
        serviceType: 'Calibration',
        serviceDescription: 'Monthly calibration check',
        assetCondition: 'Working',
        problem: 'Routine calibration required',
        approverName: 'Dr. Sarah Johnson',
        closureNotes: 'Calibration completed successfully',
        closureDate: new Date('2024-06-10'),
        closureBy: 'Dr. Tech Specialist',
        closureReason: 'Completed',
        totalCost: 0.00, // Covered under contract
        warrantyId: warranties[1].warrantyId,
      },
    }),
  ])

  console.log('✅ Created Service Requests')

  // Create Service Request Items
  console.log('📋 Creating Service Request Items...')
  const serviceRequestItems = await Promise.all([
    prisma.serviceRequestItem.create({
      data: {
        serviceRequestId: serviceRequests[0].serviceRequestId,
        partName: 'System Check',
        partCost: 0.00,
        labourCost: 0.00,
        quantity: 1,
        totalCost: 0.00,
        defectDescription: 'Routine maintenance - no defects found',
      },
    }),
    prisma.serviceRequestItem.create({
      data: {
        serviceRequestId: serviceRequests[1].serviceRequestId,
        partName: 'Calibration Service',
        partCost: 0.00,
        labourCost: 0.00,
        quantity: 1,
        totalCost: 0.00,
        defectDescription: 'Calibration completed successfully',
      },
    }),
  ])

  console.log('✅ Created Service Request Items')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Seeded Data Summary:')
  console.log(`   • Consumers: ${consumers.length}`)
  console.log(`   • Suppliers: ${suppliers.length}`)
  console.log(`   • Asset Types: ${assetTypes.length}`)
  console.log(`   • Asset Sub Types: ${assetSubTypes.length}`)
  console.log(`   • Departments: ${departments.length}`)
  console.log(`   • Contract Types: ${contractTypes.length}`)
  console.log(`   • Service Contract Statuses: ${serviceContractStatuses.length}`)
  console.log(`   • Warranty Types: ${warrantyTypes.length}`)
  console.log(`   • Purchase Orders: ${purchaseOrders.length}`)
  console.log(`   • PO Line Items: ${poLineItems.length}`)
  console.log(`   • GRNs: ${grns.length}`)
  console.log(`   • GRN Items: ${grnItems.length}`)
  console.log(`   • Assets: ${assets.length}`)
  console.log(`   • Locations: ${locations.length}`)
  console.log(`   • Installations: ${installations.length}`)
  console.log(`   • Warranties: ${warranties.length}`)
  console.log(`   • Service Contracts: ${serviceContracts.length}`)
  console.log(`   • Service Requests: ${serviceRequests.length}`)
  console.log(`   • Service Request Items: ${serviceRequestItems.length}`)
  console.log('\n🔗 All relationships established with proper foreign keys')
  console.log('✨ Ready for testing and development!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 