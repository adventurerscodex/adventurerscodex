export default class Strophe {

    static Connection = class {

        constructor(config) {
            // Do nothing
        }

        addHandler() {
            return Math.random().toString();
        }
    }

    static addNamespace = jest.fn();

    static getResourceFromJid = (jid) => {
        return jid.split('/')[1];
    };

    static getBareJidFromJid = (jid) => {
        return jid.split('/')[0];
    };

    static getNodeFromJid = (jid) => {
        return jid.split('@')[0];
    };
}
