import { DataRepository } from  'charactersheet/utilities';

// Modification Notes:
// This code has been slightly modified to fit both the AC style
// and the needs of our systems. However it is 98% the same as the
// original that can be found here:
//
// http://donjon.bin.sh/code/name/name_generator.js

let chain_cache = {};


export function generate_name(type) {
    let chain;
    if (chain = markov_chain(type)) {
        return markov_name(chain);
    }
    return '';
}


function name_list(type, n_of) {
    let list = [];

    let i;
    for (i = 0; i < n_of; i++) {
        list.push(generate_name(type));
    }
    return list;
}


function markov_chain(type) {
    let chain;
    if (chain = chain_cache[type]) {
        return chain;
    } else {
        let list;
        if ((list = DataRepository.names[type]) && list.length) {
            let chain;
            if (chain = construct_chain(list)) {
                chain_cache[type] = chain;
                return chain;
            }
        }
    }
    return false;
}



function construct_chain(list) {
    let chain = {};

    let i;
    for (i = 0; i < list.length; i++) {
        let names = list[i].split(/\s+/);
        chain = incr_chain(chain,'parts',names.length);

        let j;
        for (j = 0; j < names.length; j++) {
            let name = names[j];
            chain = incr_chain(chain,'name_len',name.length);

            let c = name.substr(0,1);
            chain = incr_chain(chain,'initial',c);

            let string = name.substr(1);
            let last_c = c;

            while (string.length > 0) {
                let c = string.substr(0,1);
                chain = incr_chain(chain,last_c,c);

                string = string.substr(1);
                last_c = c;
            }
        }
    }
    return scale_chain(chain);
}


function incr_chain(chain, key, token) {
    if (chain[key]) {
        if (chain[key][token]) {
            chain[key][token]++;
        } else {
            chain[key][token] = 1;
        }
    } else {
        chain[key] = {};
        chain[key][token] = 1;
    }
    return chain;
}


function scale_chain(chain) {
    let table_len = {};
    Object.keys(chain).forEach(key => {
        table_len[key] = 0;

        Object.keys(chain[key]).forEach(token => {
            let count = chain[key][token];
            let weighted = Math.floor(Math.pow(count,1.3));

            chain[key][token] = weighted;
            table_len[key] += weighted;
        });
    });
    chain['table_len'] = table_len;
    return chain;
}


function markov_name(chain) {
    let parts = select_link(chain,'parts');
    let names = [];

    let i;
    for (i = 0; i < parts; i++) {
        let name_len = select_link(chain,'name_len');
        let c = select_link(chain,'initial');
        let name = c;
        let last_c = c;

        while (name.length < name_len) {
            c = select_link(chain,last_c);
            if (! c) {
                break
            };

            name += c;
            last_c = c;
        }
        names.push(name);
    }
    return names.join(' ');
}


function select_link(chain, key) {
    let len = chain['table_len'][key];
    if (! len) {
        return false
    };
    let idx = Math.floor(Math.random() * len);
    let tokens = Object.keys(chain[key]);
    let acc = 0;

    let i;
    for (i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        acc += chain[key][token];
        if (acc > idx) {
            return token
        };
    }
    return false;
}
