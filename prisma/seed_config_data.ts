import { PrismaClient, ContractTypeName } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertAssetTypes() {
  const assetTypes: Array<{ code: string; assetName: string; description?: string; industryId: string }> = [
    { code: 'EQP', assetName: 'Equipment', description: 'Generic equipment', industryId: 'default' },
    { code: 'IT', assetName: 'IT Asset', description: 'Information technology hardware', industryId: 'default' },
    { code: 'MED', assetName: 'Medical Device', description: 'Clinical and biomedical devices', industryId: 'default' },
  ];

  await Promise.all(
    assetTypes.map((t) =>
      prisma.assetType.upsert({
        where: { code: t.code },
        update: { assetName: t.assetName, description: t.description ?? null, isActive: true, industryId: t.industryId },
        create: { code: t.code, assetName: t.assetName, description: t.description ?? null, industryId: t.industryId },
      })
    )
  );
}

async function upsertAssetSubTypes() {
  const subtypesConfig: Array<{ parentCode: string; subtypes: Array<{ code: string; name: string; description?: string }> }> = [
    { parentCode: 'EQP', subtypes: [
      { code: 'EQP-GEN', name: 'General Equipment' },
      { code: 'EQP-MECH', name: 'Mechanical' },
    ]},
    { parentCode: 'IT', subtypes: [
      { code: 'IT-LAP', name: 'Laptop' },
      { code: 'IT-SRV', name: 'Server' },
      { code: 'IT-NW', name: 'Networking' },
    ]},
    { parentCode: 'MED', subtypes: [
      { code: 'MED-IMG', name: 'Imaging' },
      { code: 'MED-MON', name: 'Monitoring' },
    ]},
  ];

  for (const cfg of subtypesConfig) {
    const parent = await prisma.assetType.findUnique({ where: { code: cfg.parentCode } });
    if (!parent) continue;

    // Upsert each subtype by code and bind to parent via assetTypeId
    await Promise.all(
      cfg.subtypes.map((s) =>
        prisma.assetSubType.upsert({
          where: { code: s.code },
          update: { name: s.name, description: s.description ?? null, assetTypeId: parent.id, isActive: true },
          create: { code: s.code, name: s.name, description: s.description ?? null, assetTypeId: parent.id },
        })
      )
    );
  }
}

async function upsertContractTypes() {
  const items: Array<{ typeName: ContractTypeName; typeCode: string; description?: string; contractDurationMonths?: number }>= [
    { typeName: ContractTypeName.AMC, typeCode: 'AMC', description: 'Annual Maintenance Contract', contractDurationMonths: 12 },
    { typeName: ContractTypeName.CMC, typeCode: 'CMC', description: 'Comprehensive Maintenance Contract', contractDurationMonths: 12 },
    { typeName: ContractTypeName.ON_CALL, typeCode: 'ONC', description: 'On-call support' },
    { typeName: ContractTypeName.BREAKDOWN_MAINTENANCE, typeCode: 'BDM', description: 'Breakdown maintenance' },
  ];

  await Promise.all(
    items.map((i) =>
      prisma.contractType.upsert({
        where: { typeCode: i.typeCode },
        update: {
          typeName: i.typeName,
          description: i.description ?? null,
          contractDurationMonths: i.contractDurationMonths ?? null,
        },
        create: {
          typeName: i.typeName,
          typeCode: i.typeCode,
          description: i.description ?? null,
          contractDurationMonths: i.contractDurationMonths ?? null,
        },
      })
    )
  );
}

async function upsertWarrantyTypes() {
  const items: Array<{ typeName: string; description?: string }> = [
    { typeName: 'Manufacturer', description: 'OEM warranty' },
    { typeName: 'Extended', description: 'Extended warranty purchased additionally' },
    { typeName: 'Service Contract', description: 'Warranty via service provider' },
  ];

  for (const w of items) {
    const existing = await prisma.warrantyType.findFirst({ where: { typeName: w.typeName } });
    if (existing) {
      await prisma.warrantyType.update({
        where: { warrantyTypeId: existing.warrantyTypeId },
        data: { description: w.description ?? null },
      });
    } else {
      await prisma.warrantyType.create({ data: { typeName: w.typeName, description: w.description ?? null } });
    }
  }
}

async function main() {
  await upsertAssetTypes();
  await upsertAssetSubTypes();
  await upsertContractTypes();
  await upsertWarrantyTypes();
}

main()
  .then(async () => {
    console.log('Seed config data completed.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


