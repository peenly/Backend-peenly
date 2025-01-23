const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Peenly',
      version: '1.0.0',
      description: 'Peenly Api',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    schemes: ['http'],
    components: {
      schemas: {
        ChildProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '63c9e5b5f5a48e1c4e7e3d89',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            age: {
              type: 'integer',
              example: 8,
            },
            privacy: {
              type: 'string',
              example: 'private',
            },
            guardianId: {
              type: 'string',
              example: '62c9a5b4f4a58e2c3e6d2c90',
            },
          },
        },
      },
    },
  },
  apis: ['./controllers/*.js', './routes/*.js'], // Adjust the path to include your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerDocs,
  swaggerUi,
};
