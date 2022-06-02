import * as dotenv from 'dotenv';
import { simulator, downloads, uploadEntries } from '@lsandini/cgmsim-lib';
import * as cron from 'node-cron';

dotenv.config();
const env = process.env;



async function run() {
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

		const down = await downloads(NS.NIGHTSCOUT_URL, NS.APISECRET);
		console.log(`test0, download`);
		const treatments = down.treatments;
		const entries = down.entries;
		const newEntry = simulator({ entries, treatments, env: params, profiles: [] });
		console.log(`test1, main`);
		uploadEntries({
			sgv: newEntry.sgv,
			mills: new Date().getTime()
		}, NS.NIGHTSCOUT_URL, NS.APISECRET);
		console.log(`test2, upload to `, env.nsUrl);

	} catch (e) {
		console.log(e);
	}

}
run();
const cronJob = cron.schedule(`*/5 * * * *`, run, false); //periodically execution. First after 5 minutes. 
cronJob.start();
