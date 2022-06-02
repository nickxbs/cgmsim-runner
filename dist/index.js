"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = require("dotenv");
const cgmsim_lib_1 = require("@lsandini/cgmsim-lib");
const cron = require("node-cron");
dotenv.config();
const env = process.env;
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const NS = {
                APISECRET: env.APISECRET,
                NIGHTSCOUT_URL: env.NIGHTSCOUT_URL,
            };
            const params = {
                ISF: env.ISF,
                CR: env.CR,
                DIA: env.DIA,
                WEIGHT: env.EIGHT,
                TP: env.TP,
                CARBS_ABS_TIME: env.CARBS_ABS_TIME,
            };
            console.log(`NS:`, NS);
            console.log(`params:`, params);
            const down = yield (0, cgmsim_lib_1.downloads)(NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test0, download`);
            const treatments = down.treatments;
            const entries = down.entries;
            const newEntry = (0, cgmsim_lib_1.simulator)({ entries, treatments, env: params, profiles: [] });
            console.log(`test1, main`);
            (0, cgmsim_lib_1.uploadEntries)({
                sgv: newEntry.sgv,
                mills: new Date().getTime()
            }, NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test2, upload to `, env.nsUrl);
        }
        catch (e) {
            console.log(e);
        }
    });
}
run();
const cronJob = cron.schedule(`*/5 * * * *`, run, false); //periodically execution. First after 5 minutes. 
cronJob.start();
//# sourceMappingURL=index.js.map