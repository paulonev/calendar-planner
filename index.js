/* eslint-disable no-undef */
// starts program
// JS module system reference: https://ponyfoo.com/articles/es6-modules-in-depth
import * as root from "./src/index.js";
/**
 * Solution to undefined process.env
 * Preload dotenv: node --require dotenv/config index.js (Note: you do not need to import dotenv with this approach)
 */
export default root;