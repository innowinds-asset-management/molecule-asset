import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.gRNItem.deleteMany()
  await prisma.gRN.deleteMany()
  await prisma.pOLineItem.deleteMany()
  await prisma.pO.deleteMany()
  await prisma.installation.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.assetSubType.deleteMany()
  await prisma.assetType.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create AssetTypes
  const assetTypes = await Promise.all([
    prisma.assetType.create({
      data: {
        industryId: 'ind_manufacturing',
        assetName: 'Equipment',
        code: 'EQP',
        description: 'General equipment and machinery',
        isActive: true,
      },
    }),
    prisma.assetType.create({
      data: {
        industryId: 'ind_manufacturing',
        assetName: 'Furniture',
        code: 'FUR',
        description: 'Office furniture and fixtures',
        isActive: true,
      },
    }),
    prisma.assetType.create({
      data: {
        industryId: 'ind_manufacturing',
        assetName: 'Electronics',
        code: 'ELC',
        description: 'Electronic devices and components',
        isActive: true,
      },
    }),
    prisma.assetType.create({
      data: {
        industryId: 'ind_manufacturing',
        assetName: 'Vehicles',
        code: 'VEH',
        description: 'Company vehicles and transportation',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created AssetTypes')

  // Create AssetSubTypes
  const assetSubTypes = await Promise.all([
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        name: 'Computers',
        code: 'COMP',
        description: 'Desktop and laptop computers',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        name: 'Printers',
        code: 'PRNT',
        description: 'Printing and scanning equipment',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        name: 'Servers',
        code: 'SERV',
        description: 'Server hardware and networking equipment',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[1].id, // Furniture
        name: 'Desks',
        code: 'DESK',
        description: 'Office desks and workstations',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[1].id, // Furniture
        name: 'Chairs',
        code: 'CHAIR',
        description: 'Office chairs and seating',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[2].id, // Electronics
        name: 'Phones',
        code: 'PHONE',
        description: 'Mobile phones and communication devices',
        isActive: true,
      },
    }),
    prisma.assetSubType.create({
      data: {
        assetTypeId: assetTypes[3].id, // Vehicles
        name: 'Cars',
        code: 'CAR',
        description: 'Company cars and sedans',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created AssetSubTypes')

  // Create POs (Purchase Orders)
  const pos = await Promise.all([
    prisma.pO.create({
      data: {
        consumerId: 'cons_company',
        supplierId: 'sup_dell',
        status: 'Approved',
      },
    }),
    prisma.pO.create({
      data: {
        consumerId: 'cons_company',
        supplierId: 'sup_hp',
        status: 'Approved',
      },
    }),
    prisma.pO.create({
      data: {
        consumerId: 'cons_company',
        supplierId: 'sup_office_supplies',
        status: 'Approved',
      },
    }),
    prisma.pO.create({
      data: {
        consumerId: 'cons_company',
        supplierId: 'sup_apple',
        status: 'Approved',
      },
    }),
  ])

  console.log('✅ Created Purchase Orders')

  // Create POLineItems
  const poLineItems = await Promise.all([
    prisma.pOLineItem.create({
      data: {
        poId: pos[0].id, // Dell PO
        partNo: 'DL7490-001',
        price: 1299.99,
        quantity: 10,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: pos[1].id, // HP PO
        partNo: 'HP-M404N-001',
        price: 299.99,
        quantity: 5,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: pos[2].id, // Office Supplies PO
        partNo: 'DESK-ERG-001',
        price: 599.99,
        quantity: 8,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: pos[0].id, // Dell PO
        partNo: 'DELL-R740-001',
        price: 3499.99,
        quantity: 2,
      },
    }),
    prisma.pOLineItem.create({
      data: {
        poId: pos[3].id, // Apple PO
        partNo: 'IPHONE-15-PRO-001',
        price: 999.99,
        quantity: 15,
      },
    }),
  ])

  console.log('✅ Created PO Line Items')

  // Create GRNs (Goods Received Notifications)
  const grns = await Promise.all([
    prisma.gRN.create({
      data: {
        poId: pos[0].id, // Dell PO
        dateTime: new Date('2024-01-15'),
        challan: 'CH-001-2024',
      },
    }),
    prisma.gRN.create({
      data: {
        poId: pos[1].id, // HP PO
        dateTime: new Date('2024-02-01'),
        challan: 'CH-002-2024',
      },
    }),
    prisma.gRN.create({
      data: {
        poId: pos[0].id, // Dell PO
        dateTime: new Date('2024-03-01'),
        challan: 'CH-003-2024',
      },
    }),
  ])

  console.log('✅ Created GRNs')

  // Create GRNItems
  const grnItems = await Promise.all([
    prisma.gRNItem.create({
      data: {
        grnId: grns[0].id,
        poLineItemId: poLineItems[0].id,
      },
    }),
    prisma.gRNItem.create({
      data: {
        grnId: grns[1].id,
        poLineItemId: poLineItems[1].id,
      },
    }),
    prisma.gRNItem.create({
      data: {
        grnId: grns[2].id,
        poLineItemId: poLineItems[3].id,
      },
    }),
  ])

  console.log('✅ Created GRN Items')

  // Create Assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        assetSubTypeId: assetSubTypes[0].id, // Computers
        assetName: 'Dell Latitude 7490',
        consumerId: 'cons_it_dept',
        partNo: 'DL7490-001',
        supplierId: 'sup_dell',
        supplierSerialNo: 'SN-DL7490-001',
        consumerSerialNo: 'CSN-IT-001',
        poLineItemId: poLineItems[0].id,
        warrantyPeriod: 36,
        warrantyStartDate: new Date('2024-01-15'),
        warrantyEndDate: new Date('2027-01-15'),
        warrantyId: 'WARR-001',
        installationDate: new Date('2024-01-20'),
        brand: 'Dell',
        model: 'Latitude 7490',
        subModel: 'i7-8650U',
        supplierCode: 'DELL-LAT-7490',
        isActive: true,
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        assetSubTypeId: assetSubTypes[1].id, // Printers
        assetName: 'HP LaserJet Pro M404n',
        consumerId: 'cons_admin_dept',
        partNo: 'HP-M404N-001',
        supplierId: 'sup_hp',
        supplierSerialNo: 'SN-HP-M404N-001',
        consumerSerialNo: 'CSN-ADMIN-001',
        poLineItemId: poLineItems[1].id,
        warrantyPeriod: 24,
        warrantyStartDate: new Date('2024-02-01'),
        warrantyEndDate: new Date('2026-02-01'),
        warrantyId: 'WARR-002',
        installationDate: new Date('2024-02-05'),
        brand: 'HP',
        model: 'LaserJet Pro M404n',
        subModel: 'M404n',
        supplierCode: 'HP-LJP-M404N',
        isActive: true,
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[1].id, // Furniture
        assetSubTypeId: assetSubTypes[3].id, // Desks
        assetName: 'Ergonomic Standing Desk',
        consumerId: 'cons_hr_dept',
        partNo: 'DESK-ERG-001',
        supplierId: 'sup_office_supplies',
        supplierSerialNo: 'SN-DESK-ERG-001',
        consumerSerialNo: 'CSN-HR-001',
        poLineItemId: poLineItems[2].id,
        warrantyPeriod: 60,
        warrantyStartDate: new Date('2024-01-10'),
        warrantyEndDate: new Date('2029-01-10'),
        warrantyId: 'WARR-003',
        installationDate: new Date('2024-01-12'),
        brand: 'ErgoDesk',
        model: 'Pro Standing Desk',
        subModel: '72x30',
        supplierCode: 'ERG-PRO-72X30',
        isActive: true,
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[0].id, // Equipment
        assetSubTypeId: assetSubTypes[2].id, // Servers
        assetName: 'Dell PowerEdge R740',
        consumerId: 'cons_it_dept',
        partNo: 'DELL-R740-001',
        supplierId: 'sup_dell',
        supplierSerialNo: 'SN-DELL-R740-001',
        consumerSerialNo: 'CSN-IT-002',
        poLineItemId: poLineItems[3].id,
        warrantyPeriod: 48,
        warrantyStartDate: new Date('2024-03-01'),
        warrantyEndDate: new Date('2028-03-01'),
        warrantyId: 'WARR-004',
        installationDate: new Date('2024-03-05'),
        brand: 'Dell',
        model: 'PowerEdge R740',
        subModel: '2U Rack Server',
        supplierCode: 'DELL-PE-R740',
        isActive: true,
      },
    }),
    prisma.asset.create({
      data: {
        assetTypeId: assetTypes[2].id, // Electronics
        assetSubTypeId: assetSubTypes[5].id, // Phones
        assetName: 'iPhone 15 Pro',
        consumerId: 'cons_sales_dept',
        partNo: 'IPHONE-15-PRO-001',
        supplierId: 'sup_apple',
        supplierSerialNo: 'SN-IPHONE-15-PRO-001',
        consumerSerialNo: 'CSN-SALES-001',
        poLineItemId: poLineItems[4].id,
        warrantyPeriod: 12,
        warrantyStartDate: new Date('2024-04-01'),
        warrantyEndDate: new Date('2025-04-01'),
        warrantyId: 'WARR-005',
        installationDate: new Date('2024-04-02'),
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        subModel: '256GB',
        supplierCode: 'APPLE-IPHONE-15-PRO',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created Assets')

  // Create Departments first
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        deptName: 'IT Department',
        consumerId: 'consumer_1',
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Administration',
        consumerId: 'consumer_1',
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Human Resources',
        consumerId: 'consumer_1',
      },
    }),
    prisma.department.create({
      data: {
        deptName: 'Sales Department',
        consumerId: 'consumer_1',
      },
    }),
  ])

  console.log('✅ Created Departments')

  // Create Locations
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
        departmentId: departments[1].deptId, // Administration
        building: 'Building B',
        floorNumber: '1',
        roomNumber: '105',
        isCurrentLocation: true,
      },
    }),
    prisma.location.create({
      data: {
        assetId: assets[2].id,
        departmentId: departments[2].deptId, // Human Resources
        building: 'Building A',
        floorNumber: '3',
        roomNumber: '301',
        isCurrentLocation: true,
      },
    }),
    prisma.location.create({
      data: {
        assetId: assets[3].id,
        departmentId: departments[0].deptId, // IT Department
        building: 'Data Center',
        floorNumber: '1',
        roomNumber: 'DC-01',
        isCurrentLocation: true,
      },
    }),
    prisma.location.create({
      data: {
        assetId: assets[4].id,
        departmentId: departments[3].deptId, // Sales Department
        building: 'Building C',
        floorNumber: '1',
        roomNumber: '101',
        isCurrentLocation: true,
      },
    }),
  ])

  console.log('✅ Created Locations')

  // Create Installations
  const installations = await Promise.all([
    prisma.installation.create({
      data: {
        assetId: assets[0].id,
        locationId: locations[0].id,
        departmentId: departments[0].deptId,
        installationDate: new Date('2024-01-15'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[1].id,
        locationId: locations[1].id,
        departmentId: departments[1].deptId,
        installationDate: new Date('2024-01-20'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[2].id,
        locationId: locations[2].id,
        departmentId: departments[2].deptId,
        installationDate: new Date('2024-02-01'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[3].id,
        locationId: locations[3].id,
        departmentId: departments[0].deptId,
        installationDate: new Date('2024-02-10'),
      },
    }),
    prisma.installation.create({
      data: {
        assetId: assets[4].id,
        locationId: locations[4].id,
        departmentId: departments[3].deptId,
        installationDate: new Date('2024-02-15'),
      },
    }),
  ])

  console.log('✅ Created Installations')

  // Update PO Line Items with GRN references
  await Promise.all([
    prisma.pOLineItem.update({
      where: { id: poLineItems[0].id },
      data: { grnId: grns[0].id },
    }),
    prisma.pOLineItem.update({
      where: { id: poLineItems[1].id },
      data: { grnId: grns[1].id },
    }),
    prisma.pOLineItem.update({
      where: { id: poLineItems[3].id },
      data: { grnId: grns[2].id },
    }),
  ])

  console.log('✅ Updated PO Line Items with GRN references')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Seeded Data Summary:')
  console.log(`   • AssetTypes: ${assetTypes.length}`)
  console.log(`   • AssetSubTypes: ${assetSubTypes.length}`)
  console.log(`   • Assets: ${assets.length}`)
  console.log(`   • Departments: ${departments.length}`)
  console.log(`   • Locations: ${locations.length}`)
  console.log(`   • Installations: ${installations.length}`)
  console.log(`   • Purchase Orders: ${pos.length}`)
  console.log(`   • PO Line Items: ${poLineItems.length}`)
  console.log(`   • GRNs: ${grns.length}`)
  console.log(`   • GRN Items: ${grnItems.length}`)
  console.log('\n🔗 Relationships established with cuid() generated IDs')
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