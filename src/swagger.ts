import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hire BandB API',
      version: '1.0.0',
      description: 'API documentation for Hire BandB backend',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Bike: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            rentAmount: { type: 'number' },
            status: { type: 'string', enum: ['AVAILABLE', 'RENTED', 'MAINTENANCE'] },
            categoryId: { type: 'integer' },
            ownerId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BikeCreate: {
          type: 'object',
          required: ['name', 'rentAmount'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            rentAmount: { type: 'number' },
            categoryId: { type: 'integer' },
          },
        },
      },
    },
  },
  // look for JSDoc comments in route files
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
