"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// a regex for matching srcset segments
const SRCSEG = /(\S*[^,\s])(\s+([\d.]+)(x|w))?/g;
// defines how srcset descriptors translate into human-readable names
const DescriptorNames = { w: "width", x: "density" };
/*
 * Parses an srcset string and returns an array of objects
 * @param {string} an srcset string
 * @returns {ImageCandidate[]}
 */
const parse = (srcset) => matchAll(srcset, SRCSEG).map(([, url, , value, modifier]) => {
    let modKey = DescriptorNames[modifier];
    // descriptor is optional
    return modKey ? { url, [modKey]: parseFloat(value) } : { url };
});
/*
 * Similar to String.prototype.matchAll, but returns an array
 * rather than the iterable. It also works everywhere, including IE11.
 * (`String.prototype.matchAll` doesn't).
 */
const matchAll = (str, regex) => {
    let match = null, result = [];
    while ((match = regex.exec(str)) !== null)
        result.push(match);
    return result;
};
exports.default = parse;
