import { ApplicationConfig, VendorApplication } from './application';
import { configFn } from './helpers/config';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  // Fetching Configurations before starting applications
  const env = 'development';
  const configurations = await configFn(env);
  global.centralConfig = configurations;
  global.env = env;

  const app = new VendorApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  // Dynamic import
  // Establishing connection only after config load and app bootstrap
  import('./helpers/mongo-connection')
    .then(data => {
      data.default.establishConnection().catch(() => {});
    })
    .catch(err => {
      console.error('Error in dynamic importing mongo connection');
    });

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
