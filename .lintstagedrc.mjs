const linststagedConfig = {
  "*.{css,js,cjs,mjs,ts,cts,mts,jsx,tsx}": () => "npm run lint:fix",
};

export default linststagedConfig;
