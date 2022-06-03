"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = require("dotenv");
const cgmsim_lib_1 = require("@lsandini/cgmsim-lib");
const cron = require("node-cron");
dotenv.config();
const env = process.env;
const logLevel = env.LOG_LEVEL;
let lastState;
function runUVA() {
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
            const down = yield cgmsim_lib_1.downloads(NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test0, download`);
            const treatments = down.treatments;
            const entries = down.entries;
            const profiles = down.profiles;
            const newEntry = cgmsim_lib_1.simulatorUVA({ treatments, env: params, lastState, profiles, entries });
            lastState = newEntry.x;
            console.log(`test1, main`);
            yield cgmsim_lib_1.uploadEntries({
                sgv: Math.round(newEntry.y.Gp),
                direction: 'Flat',
            }, NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test2, upload to `, env.NIGHTSCOUT_URL);
        }
        catch (e) {
            console.log(e);
        }
    });
}
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
            const down = yield cgmsim_lib_1.downloads(NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test0, download`);
            const treatments = down.treatments;
            const entries = down.entries;
            const newEntry = cgmsim_lib_1.simulator({ entries, treatments, env: params, profiles: [] });
            console.log(`test1, main`);
            yield cgmsim_lib_1.uploadEntries({
                sgv: newEntry.sgv,
                direction: newEntry.direction
            }, NS.NIGHTSCOUT_URL, NS.APISECRET);
            console.log(`test2, upload to `, env.nsUrl);
            if (logLevel === 'debug') {
                const notes = `
			sgv:${newEntry.sgv}<br>
			min:${newEntry.deltaMinutes}<br>
			carb:${newEntry.carbsActivity.toFixed(4)}<br>
			bas:${newEntry.basalActivity.toFixed(4)}<br>
			bol:${newEntry.bolusActivity.toFixed(4)}<br>
			liv:${newEntry.liverActivity.toFixed(4)}<br>
			noise:${newEntry.noiseActivity.toFixed(4)}<br>
			pump:${newEntry.pumpBasalActivity.toFixed(4)} `;
                yield cgmsim_lib_1.uploadNotes(notes, NS.NIGHTSCOUT_URL, NS.APISECRET);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
// runUVA();
// const cronJob = cron.schedule(`*/5 * * * *`, runUVA, false); //periodically execution. First after 5 minutes. 
run();
const cronJob = cron.schedule(`*/5 * * * *`, run, false); //periodically execution. First after 5 minutes. 
cronJob.start();
//# sourceMappingURL=index.js.map