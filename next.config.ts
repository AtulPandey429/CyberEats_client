import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin workspace root — avoids Turbopack picking up parent lockfile (C:\Users\LENOVO\package-lock.json)
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
