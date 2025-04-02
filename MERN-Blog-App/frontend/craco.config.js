import path from 'path';
import { fileURLToPath } from 'url';
import pathBrowserify from 'path-browserify';
import osBrowserify from 'os-browserify/browser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": pathBrowserify,
          "os": osBrowserify,
          "fs": false
        }
      }
    }
  }
}; 
