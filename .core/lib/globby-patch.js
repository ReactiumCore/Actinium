import _ from 'underscore';
import path from 'node:path';
import { globby as Globby, globbySync as GlobbySync } from 'globby';

const _patterns = str =>
    _.chain([str])
        .flatten()
        .compact()
        .value()
        .map(pattern => pattern.split(/[\\\/]/g).join(path.posix.sep));

export const globbySync = (patterns, options) =>
    GlobbySync(_patterns(patterns), options);

export const globby = (patterns, options) =>
    Globby(_patterns(patterns), options);

globby.sync = globbySync;

export default globby;
