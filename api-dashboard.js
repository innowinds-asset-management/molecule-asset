const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(express.json());
app.use(express.static('.'));

// API endpoint to get all data
app.get('/api/all-data', async (req, res) => {
    try {
        const [
            assetTypes,
            assetSubTypes,
            assets,
            installations,
            pos,
            poLineItems,
            grns,
            grnItems
        ] = await Promise.all([
            prisma.assetType.findMany(),
            prisma.assetSubType.findMany(),
            prisma.asset.findMany(),
            prisma.installation.findMany(),
            prisma.pO.findMany(),
            prisma.pOLineItem.findMany(),
            prisma.gRN.findMany(),
            prisma.gRNItem.findMany()
        ]);

        res.json({
            assetType: assetTypes,
            assetSubType: assetSubTypes,
            asset: assets,
            installation: installations,
            po: pos,
            poLineItem: poLineItems,
            grn: grns,
            grnItem: grnItems
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API endpoint to get specific model data
app.get('/api/model/:modelName', async (req, res) => {
    const { modelName } = req.params;
    
    try {
        let data;
        switch (modelName.toLowerCase()) {
            case 'assettype':
                data = await prisma.assetType.findMany();
                break;
            case 'assetsubtype':
                data = await prisma.assetSubType.findMany();
                break;
            case 'asset':
                data = await prisma.asset.findMany();
                break;
            case 'installation':
                data = await prisma.installation.findMany();
                break;
            case 'po':
                data = await prisma.pO.findMany();
                break;
            case 'polineitem':
                data = await prisma.pOLineItem.findMany();
                break;
            case 'grn':
                data = await prisma.gRN.findMany();
                break;
            case 'grnitem':
                data = await prisma.gRNItem.findMany();
                break;
            default:
                return res.status(404).json({ error: 'Model not found' });
        }
        
        res.json(data);
    } catch (error) {
        console.error(`Error fetching ${modelName}:`, error);
        res.status(500).json({ error: `Failed to fetch ${modelName}` });
    }
});

// API endpoint to get model statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [
            assetTypeCount,
            assetSubTypeCount,
            assetCount,
            installationCount,
            poCount,
            poLineItemCount,
            grnCount,
            grnItemCount
        ] = await Promise.all([
            prisma.assetType.count(),
            prisma.assetSubType.count(),
            prisma.asset.count(),
            prisma.installation.count(),
            prisma.pO.count(),
            prisma.pOLineItem.count(),
            prisma.gRN.count(),
            prisma.gRNItem.count()
        ]);

        res.json({
            totalRecords: assetTypeCount + assetSubTypeCount + assetCount + installationCount + 
                         poCount + poLineItemCount + grnCount + grnItemCount,
            models: 8,
            activeModels: 8,
            modelCounts: {
                assetType: assetTypeCount,
                assetSubType: assetSubTypeCount,
                asset: assetCount,
                installation: installationCount,
                po: poCount,
                poLineItem: poLineItemCount,
                grn: grnCount,
                grnItem: grnItemCount
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Serve the dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'multi-model-dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Dashboard API running on http://localhost:${PORT}`);
    console.log(`Prisma Studio is running on http://localhost:5556`);
    console.log(`\nAccess your multi-model dashboard at: http://localhost:${PORT}`);
}); 