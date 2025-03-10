/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Polyfill for older browsers that do not support `Promise` or `fetch`
import 'core-js/features/promise';
import 'core-js/features/reflect';  // Reflect API is used by Angular for reflection

/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.