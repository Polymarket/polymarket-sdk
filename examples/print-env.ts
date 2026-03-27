/**
 * Small helper that prints the environment variables used by the examples.
 *
 * This file does not depend on the SDK itself and can be used to quickly
 * verify that .env is configured correctly.
 *
 * Usage:
 *   ts-node examples/print-env.ts
 * or
 *   node dist/examples/print-env.js
 */

function printEnvVar(name: string) {
  const value = process.env[name];
  if (!value) {
    console.warn(`⚠️  ${name} is not set`);
  } else {
    console.log(`✅ ${name} = ${value.substring(0, 4)}... (hidden)`);
  }
}

function main() {
  console.log("Checking Polymarket SDK example environment…");
  printEnvVar("POLYMARKET_API_BASE");
  printEnvVar("POLYMARKET_API_KEY");
  printEnvVar("POLYMARKET_WALLET_PRIVATE_KEY");
  printEnvVar("POLYMARKET_NETWORK");
}

main();
