import * as characterClazz from './character';
import * as commonClazz from './common';

import { forIn, set } from 'lodash';

/* Generate a key/value set to generate new classes from its name */

const allClazz = {};

const mapClazz = (clazz) => {
    if (clazz.name) {
        set(allClazz, clazz.name, clazz );
    }
};

forIn(commonClazz, mapClazz);
forIn(characterClazz, mapClazz);

export default allClazz;
