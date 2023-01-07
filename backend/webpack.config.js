import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import NodeConfigWebpack from "node-config-webpack";
const __filenameNew = fileURLToPath(import.meta.url);
const __dirnameNew = path.dirname(__filenameNew);

export default {
  mode: "production",
  entry: {
    backend: "./server.js",
    refresh: "./autoRefresh.js",
  },
  target: "node",
  output: {
    path: path.resolve(__dirnameNew, "dist"),
    filename: "[name].js",
  },
  optimization: {
    minimizer: [new TerserPlugin({ terserOptions: { mangle: false } })],
    // mangle false else mysql blow ups with "PROTOCOL_INCORRECT_PACKET_SEQUENCE"
  },
  plugins: [new NodeConfigWebpack()],
};
