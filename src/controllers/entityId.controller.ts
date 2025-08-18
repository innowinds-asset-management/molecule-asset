import { Request, Response } from 'express';
import { generateEntityId } from '../utils/entityIdGenerator';

/**
 * Generate a unique entity ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const generateEntityIdController = async (req: Request, res: Response) => {
  try {
    const { entityName } = req.query;

    // Validate input
    if (!entityName || typeof entityName !== 'string') {
      return res.status(400).json({ 
        error: 'entityName is required and must be a string' 
      });
    }

    // Generate the entity ID
    const entityId = generateEntityId(entityName);

    return res.status(200).json({
      success: true,
      data: {
        entityId,
        entityName,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating entity ID:', error);
    return res.status(500).json({ 
      error: 'Internal server error while generating entity ID' 
    });
  }
};
