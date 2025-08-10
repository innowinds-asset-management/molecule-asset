import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Consumer Service API',
      version: '1.0.0',
      description: 'A microservice for managing users, consumers, and sites with hierarchical relationships',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              description: 'User password (hashed)'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            },
            consumers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Consumer'
              },
              description: 'List of consumers associated with this user'
            }
          },
          required: ['id', 'email', 'password', 'name', 'isActive', 'createdAt', 'updatedAt']
        },
        Consumer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the consumer'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Consumer email address'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Consumer phone number'
            },
            company: {
              type: 'string',
              nullable: true,
              description: 'Company name'
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Street address'
            },
            city: {
              type: 'string',
              nullable: true,
              description: 'City name'
            },
            state: {
              type: 'string',
              nullable: true,
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              nullable: true,
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              description: 'Country code',
              default: 'US'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the consumer is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Consumer creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Consumer last update timestamp'
            },
            userId: {
              type: 'string',
              description: 'ID of the user this consumer belongs to'
            },
            user: {
              $ref: '#/components/schemas/User',
              description: 'Associated user information'
            },
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              },
              description: 'List of users associated with this consumer'
            }
          },
          required: ['id', 'email', 'country', 'isActive', 'createdAt', 'updatedAt', 'userId']
        },

        CreateUserDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            },
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'User full name'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active',
              default: true
            }
          },
          required: ['email', 'password', 'name']
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            },
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'User full name'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active'
            }
          }
        },
        CreateConsumerDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Consumer email address'
            },
            phone: {
              type: 'string',
              description: 'Consumer phone number'
            },
            company: {
              type: 'string',
              description: 'Company name'
            },
            address: {
              type: 'string',
              description: 'Street address'
            },
            city: {
              type: 'string',
              description: 'City name'
            },
            state: {
              type: 'string',
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              description: 'Country code',
              default: 'US'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the consumer is active',
              default: true
            },
            userId: {
              type: 'string',
              description: 'ID of the user this consumer belongs to (required)'
            }
          },
          required: ['email', 'userId']
        },
        UpdateConsumerDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Consumer email address'
            },
            phone: {
              type: 'string',
              description: 'Consumer phone number'
            },
            company: {
              type: 'string',
              description: 'Company name'
            },
            address: {
              type: 'string',
              description: 'Street address'
            },
            city: {
              type: 'string',
              description: 'City name'
            },
            state: {
              type: 'string',
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              description: 'Country code'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the consumer is active'
            },
            userId: {
              type: 'string',
              description: 'ID of the user this consumer belongs to'
            }
          }
        },

        PaginationResult: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Array of items'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                limit: {
                  type: 'integer',
                  description: 'Number of items per page'
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items'
                },
                pages: {
                  type: 'integer',
                  description: 'Total number of pages'
                },
                hasNextPage: {
                  type: 'boolean',
                  description: 'Whether there is a next page'
                },
                hasPreviousPage: {
                  type: 'boolean',
                  description: 'Whether there is a previous page'
                }
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Overall health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Health check timestamp'
            },
            service: {
              type: 'string',
              description: 'Service name'
            },
            version: {
              type: 'string',
              description: 'Service version'
            },
            environment: {
              type: 'string',
              description: 'Environment name'
            },
            checks: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  enum: ['healthy', 'unhealthy'],
                  description: 'Database health status'
                },
                memory: {
                  type: 'object',
                  description: 'Memory usage information'
                },
                uptime: {
                  type: 'number',
                  description: 'Service uptime in seconds'
                }
              }
            }
          }
        },
        SignupDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (will be encrypted with email combination)'
            },
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'User full name'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Whether the user account is active'
            }
          },
          required: ['email', 'password', 'name']
        },
        LoginDto: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User ID (used as username)'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          },
          required: ['userId', 'password']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'User ID'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'User email'
                },
                name: {
                  type: 'string',
                  description: 'User name'
                },
                isActive: {
                  type: 'boolean',
                  description: 'Whether user is active'
                }
              }
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            }
          }
        },
        Department: {
          type: 'object',
          properties: {
            deptId: {
              type: 'string',
              description: 'Unique identifier for the department'
            },
            deptName: {
              type: 'string',
              description: 'Department name'
            },
            consumerId: {
              type: 'string',
              description: 'ID of the consumer this department belongs to'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Department creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Department last update timestamp'
            }
          },
          required: ['deptId', 'deptName', 'consumerId', 'createdAt', 'updatedAt']
        },
        CreateDepartmentDto: {
          type: 'object',
          properties: {
            deptName: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Department name'
            },
            consumerId: {
              type: 'string',
              description: 'ID of the consumer this department belongs to'
            }
          },
          required: ['deptName', 'consumerId']
        },
        Location: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the location'
            },
            assetId: {
              type: 'string',
              description: 'ID of the asset this location belongs to'
            },
            departmentId: {
              type: 'string',
              description: 'ID of the department this location belongs to'
            },
            building: {
              type: 'string',
              nullable: true,
              description: 'Building name or identifier'
            },
            floorNumber: {
              type: 'string',
              nullable: true,
              description: 'Floor number'
            },
            roomNumber: {
              type: 'string',
              nullable: true,
              description: 'Room number'
            },
            isCurrentLocation: {
              type: 'boolean',
              description: 'Whether this is the current location of the asset',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Location creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Location last update timestamp'
            }
          },
          required: ['id', 'assetId', 'departmentId', 'isCurrentLocation', 'createdAt', 'updatedAt']
        },
        CreateLocationDto: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset this location belongs to'
            },
            departmentId: {
              type: 'string',
              description: 'ID of the department this location belongs to'
            },
            building: {
              type: 'string',
              description: 'Building name or identifier'
            },
            floorNumber: {
              type: 'string',
              description: 'Floor number'
            },
            roomNumber: {
              type: 'string',
              description: 'Room number'
            },
            isCurrentLocation: {
              type: 'boolean',
              description: 'Whether this is the current location of the asset',
              default: true
            }
          },
          required: ['assetId', 'departmentId']
        },
        Asset: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the asset'
            },
            assetTypeId: {
              type: 'string',
              description: 'ID of the asset type'
            },
            assetSubTypeId: {
              type: 'string',
              description: 'ID of the asset subtype'
            },
            assetName: {
              type: 'string',
              description: 'Name of the asset'
            },
            warrantyPeriod: {
              type: 'integer',
              nullable: true,
              description: 'Warranty period in months'
            },
            warrantyStartDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Warranty start date'
            },
            warrantyEndDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Warranty end date'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Asset installation date'
            },
            brand: {
              type: 'string',
              nullable: true,
              description: 'Asset brand'
            },
            model: {
              type: 'string',
              nullable: true,
              description: 'Asset model'
            },
            subModel: {
              type: 'string',
              nullable: true,
              description: 'Asset sub-model'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the asset is active',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Asset creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Asset last update timestamp'
            },
            consumerId: {
              type: 'string',
              description: 'ID of the consumer this asset belongs to'
            },
            partNo: {
              type: 'string',
              nullable: true,
              description: 'Part number'
            },
            supplierCode: {
              type: 'string',
              nullable: true,
              description: 'Supplier code'
            },
            warrantyId: {
              type: 'string',
              nullable: true,
              description: 'Warranty ID'
            },
            consumerSerialNo: {
              type: 'string',
              nullable: true,
              description: 'Consumer serial number'
            },
            grnId: {
              type: 'string',
              nullable: true,
              description: 'Goods Received Note ID'
            },
            grnItemId: {
              type: 'string',
              nullable: true,
              description: 'Goods Received Note Item ID'
            },
            poLineItemId: {
              type: 'string',
              nullable: true,
              description: 'Purchase Order Line Item ID'
            },
            supplierId: {
              type: 'string',
              nullable: true,
              description: 'Supplier ID'
            },
            supplierSerialNo: {
              type: 'string',
              nullable: true,
              description: 'Supplier serial number'
            }
          },
          required: ['id', 'assetTypeId', 'assetSubTypeId', 'assetName', 'isActive', 'createdAt', 'updatedAt', 'consumerId']
        },
        CreateAssetDto: {
          type: 'object',
          properties: {
            assetTypeId: {
              type: 'string',
              description: 'ID of the asset type'
            },
            assetSubTypeId: {
              type: 'string',
              description: 'ID of the asset subtype'
            },
            assetName: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Name of the asset'
            },
            warrantyPeriod: {
              type: 'integer',
              description: 'Warranty period in months'
            },
            warrantyStartDate: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty start date'
            },
            warrantyEndDate: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty end date'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Asset installation date'
            },
            brand: {
              type: 'string',
              description: 'Asset brand'
            },
            model: {
              type: 'string',
              description: 'Asset model'
            },
            subModel: {
              type: 'string',
              description: 'Asset sub-model'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the asset is active',
              default: true
            },
            consumerId: {
              type: 'string',
              description: 'ID of the consumer this asset belongs to'
            },
            partNo: {
              type: 'string',
              description: 'Part number'
            },
            supplierCode: {
              type: 'string',
              description: 'Supplier code'
            },
            warrantyId: {
              type: 'string',
              description: 'Warranty ID'
            },
            consumerSerialNo: {
              type: 'string',
              description: 'Consumer serial number'
            },
            grnId: {
              type: 'string',
              description: 'Goods Received Note ID'
            },
            grnItemId: {
              type: 'string',
              description: 'Goods Received Note Item ID'
            },
            poLineItemId: {
              type: 'string',
              description: 'Purchase Order Line Item ID'
            },
            supplierId: {
              type: 'string',
              description: 'Supplier ID'
            },
            supplierSerialNo: {
              type: 'string',
              description: 'Supplier serial number'
            }
          },
          required: ['assetTypeId', 'assetSubTypeId', 'assetName', 'consumerId']
        },
        UpdateAssetDto: {
          type: 'object',
          properties: {
            assetTypeId: {
              type: 'string',
              description: 'ID of the asset type'
            },
            assetSubTypeId: {
              type: 'string',
              description: 'ID of the asset subtype'
            },
            assetName: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Name of the asset'
            },
            warrantyPeriod: {
              type: 'integer',
              description: 'Warranty period in months'
            },
            warrantyStartDate: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty start date'
            },
            warrantyEndDate: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty end date'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Asset installation date'
            },
            brand: {
              type: 'string',
              description: 'Asset brand'
            },
            model: {
              type: 'string',
              description: 'Asset model'
            },
            subModel: {
              type: 'string',
              description: 'Asset sub-model'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the asset is active'
            },
            consumerId: {
              type: 'string',
              description: 'ID of the consumer this asset belongs to'
            },
            partNo: {
              type: 'string',
              description: 'Part number'
            },
            supplierCode: {
              type: 'string',
              description: 'Supplier code'
            },
            warrantyId: {
              type: 'string',
              description: 'Warranty ID'
            },
            consumerSerialNo: {
              type: 'string',
              description: 'Consumer serial number'
            },
            grnId: {
              type: 'string',
              description: 'Goods Received Note ID'
            },
            grnItemId: {
              type: 'string',
              description: 'Goods Received Note Item ID'
            },
            poLineItemId: {
              type: 'string',
              description: 'Purchase Order Line Item ID'
            },
            supplierId: {
              type: 'string',
              description: 'Supplier ID'
            },
            supplierSerialNo: {
              type: 'string',
              description: 'Supplier serial number'
            }
          }
        },
        CreateAssetCompleteDto: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/CreateAssetDto'
          },
          description: 'Array of assets to create with locations and installations'
        },
        AssetComplete: {
          type: 'object',
          properties: {
            assets: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Asset'
              },
              description: 'Array of created assets'
            },
            locations: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Location'
              },
              description: 'Array of created locations'
            },
            installations: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Installation'
              },
              description: 'Array of created installations'
            }
          },
          description: 'Complete asset creation result with related locations and installations'
        },
        Installation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the installation'
            },
            assetId: {
              type: 'string',
              description: 'ID of the asset being installed'
            },
            locationId: {
              type: 'string',
              description: 'ID of the location where the asset is installed'
            },
            departmentId: {
              type: 'string',
              description: 'ID of the department responsible for the installation'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the installation'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Installation record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Installation record last update timestamp'
            }
          },
          required: ['id', 'assetId', 'locationId', 'departmentId', 'installationDate', 'createdAt', 'updatedAt']
        },
        CreateInstallationDto: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset being installed'
            },
            locationId: {
              type: 'string',
              description: 'ID of the location where the asset is installed'
            },
            departmentId: {
              type: 'string',
              description: 'ID of the department responsible for the installation'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the installation'
            }
          },
          required: ['assetId', 'locationId', 'departmentId', 'installationDate']
        },
        UpdateInstallationDto: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset being installed'
            },
            locationId: {
              type: 'string',
              description: 'ID of the location where the asset is installed'
            },
            departmentId: {
              type: 'string',
              description: 'ID of the department responsible for the installation'
            },
            installationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the installation'
            }
          }
        },
        WarrantyType: {
          type: 'object',
          properties: {
            warrantyTypeId: {
              type: 'integer',
              description: 'Unique identifier for the warranty type'
            },
            typeName: {
              type: 'string',
              description: 'Name of the warranty type'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Description of the warranty type'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty type creation timestamp'
            }
          },
          required: ['warrantyTypeId', 'typeName', 'createdAt']
        },
        Warranty: {
          type: 'object',
          properties: {
            warrantyId: {
              type: 'integer',
              description: 'Unique identifier for the warranty'
            },
            assetId: {
              type: 'string',
              description: 'ID of the asset this warranty belongs to'
            },
            warrantyTypeId: {
              type: 'integer',
              description: 'ID of the warranty type'
            },
            warrantySupplierId: {
              type: 'string',
              nullable: true,
              description: 'Supplier ID for the warranty'
            },
            warrantyNumber: {
              type: 'string',
              nullable: true,
              description: 'Warranty number'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Start date of the warranty'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'End date of the warranty'
            },
            warrantyPeriod: {
              type: 'integer',
              nullable: true,
              description: 'Warranty period in months'
            },
            coverageType: {
              type: 'string',
              nullable: true,
              description: 'Type of coverage'
            },
            coverageDescription: {
              type: 'string',
              nullable: true,
              description: 'Description of coverage'
            },
            termsConditions: {
              type: 'string',
              nullable: true,
              description: 'Terms and conditions'
            },
            cost: {
              type: 'number',
              nullable: true,
              description: 'Cost of the warranty'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the warranty is active',
              default: true
            },
            autoRenewal: {
              type: 'boolean',
              description: 'Whether the warranty auto-renews',
              default: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty last update timestamp'
            },
            consumerId: {
              type: 'integer',
              nullable: true,
              description: 'Consumer ID'
            },
            supplierId: {
              type: 'integer',
              nullable: true,
              description: 'Supplier ID'
            },
            warrantyType: {
              $ref: '#/components/schemas/WarrantyType',
              description: 'Associated warranty type information'
            },
            asset: {
              $ref: '#/components/schemas/Asset',
              description: 'Associated asset information'
            }
          },
          required: ['warrantyId', 'assetId', 'warrantyTypeId', 'startDate', 'endDate', 'isActive', 'autoRenewal', 'createdAt', 'updatedAt']
        },
        ServiceRequest: {
          type: 'object',
          properties: {
            serviceRequestId: {
              type: 'string',
              description: 'Unique identifier for the service request'
            },
            assetId: {
              type: 'string',
              description: 'ID of the asset this service request belongs to'
            },
            technicianName: {
              type: 'string',
              description: 'Name of the technician'
            },
            serviceSupplierId: {
              type: 'string',
              nullable: true,
              description: 'Supplier ID providing the service'
            },
            serviceContractId: {
              type: 'string',
              nullable: true,
              description: 'Related service contract ID'
            },
            srNo: {
              type: 'string',
              nullable: true,
              description: 'Service Request number'
            },
            warrantyStatus: {
              type: 'string',
              enum: ['ACTIVE', 'EXPIRED', 'VOID', 'CLAIMED', 'PENDING_CLAIM', 'TRANSFERRED', 'SUSPENDED', 'NOT_APPLICABLE'],
              description: 'Status of the warranty'
            },
            serviceStatus: {
              type: 'string',
              nullable: true,
              description: 'Status of the service'
            },
            serviceDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the service'
            },
            serviceType: {
              type: 'string',
              nullable: true,
              description: 'Type of service (Preventive, Repair, Installation)'
            },
            serviceDescription: {
              type: 'string',
              nullable: true,
              description: 'Description of the service'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Service request creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Service request last update timestamp'
            },
            approverName: {
              type: 'string',
              nullable: true,
              description: 'Name of the approver'
            },
            serviceRequestItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ServiceRequestItem'
              },
              description: 'List of service request items'
            }
          },
          required: ['serviceRequestId', 'assetId', 'technicianName', 'warrantyStatus', 'serviceDate', 'createdAt', 'updatedAt']
        },
      },
      parameters: {
        page: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        limit: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        search: {
          name: 'search',
          in: 'query',
          description: 'Search term for filtering results',
          schema: {
            type: 'string'
          }
        },
        isActive: {
          name: 'isActive',
          in: 'query',
          description: 'Filter by active status',
          schema: {
            type: 'boolean'
          }
        },
        userId: {
          name: 'userId',
          in: 'query',
          description: 'Filter by user ID',
          schema: {
            type: 'string'
          }
        },

      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options); 