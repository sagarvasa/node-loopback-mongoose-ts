const development = {
  host: '127.0.0.1',
  port: 27017,
  database: 'vendor_management',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 3,
  timeout: 30000, // (30 * 1000ms = 30 sec)
};

const staging = {
  host: 'staging-abc.docdb.amazonaws.com',
  port: 27017,
  database: 'vendor_management',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 5,
  timeout: 30000,
};

const dev = {
  host: 'dev-abc.docdb.amazonaws.com',
  port: 27017,
  database: 'vendor_management',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 10,
  timeout: 30000,
};

const production = {
  host: 'prd-abc.docdb.amazonaws.com',
  port: 27017,
  database: 'vendor_management',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 10,
  timeout: 30000,
};

const config = { development, dev, staging, production };

export async function configFn(nodeEnv: keyof typeof config) {
  return config[nodeEnv];
}
