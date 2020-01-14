const fs = require('fs');


class Logger {
    constructor() {
        this.level = 2;
    }
   // static version = "1.0.0";



    debug(msg)  {
        let level = this.level;
        if (level <= 0) {
            console.debug(`DEBUG: ${msg}`);
        }
    };

    log(msg) {
        let level = this.level;
        if (level <= 1) {
            console.log(`INFO: ${msg}`);
        }
    };
    info(msg) {this.log(msg);};

    warn(msg) {
        let level = this.level;
        if (level <= 2) {
            console.warn(`WARN: ${msg}`);
        }
    };

    error(msg) {
        let level = this.level;
        if (level <= 3) {
            console.error(`ERROR: ${msg}`);
        }
    };

    setlevel(level) {
        switch (level.toLowerCase()) {
            case "debug":
                this.level = 0;
                break;
            case "info":
                this.level = 1;
                break;
            case "warn":
                this.level = 2;
                break;
            case "error":
                this.level = 3;
                break;
            case "off":
                this.level = -1;
                break;
            default:
                this.level = 2;
        }
    }
}


module.exports = {
    Logger: Logger
    // version: "1.0.0",
    //
    // debug: debug,
    // log: log,
    // info: log,
    // warn: warn,
    // error: error,

    // setlevel(level) {
    //     switch (level.toLowerCase()) {
    //         case "debug": module.exports.level = 0; break;
    //         case "info": module.exports.level = 1; break;
    //         case "warn": module.exports.level = 2; break;
    //         case "error": module.exports.level = 3; break;
    //         case "off": module.exports.level = -1; break;
    //         default: module.exports.level = 2;
    //     }
    //     console.log(`Log Level Set : ${this.level}`);
    // }
};