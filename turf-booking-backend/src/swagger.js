import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Turf Booking API",
      version: "1.0.0",
      description: "API documentation for Turf"
    },
    servers: [
      {
        url: "http://localhost:3000",
      }
    ],
  },
  apis: ["./src/routes/*.js"], // where swagger reads comments
};

export const swaggerSpec = swaggerJSDoc(options);