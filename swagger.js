const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Peenly',
      version: '1.0.0',
      description: 'Peenly API', 
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server', 
      },
    ],
    schemes: ['http'],
    components: {
    }
  },
  apis: ['./controllers/*.js', './routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerDocs,
  swaggerUi,
};
