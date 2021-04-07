import { opine, json } from 'https://deno.land/x/opine@1.2.0/mod.ts';
import { opineCors } from 'https://deno.land/x/cors/mod.ts';

const app = opine();

app.use(json());
app.use(opineCors());

const {PORT, SCHEMA, CSE_IP, CSE_PORT} = JSON.parse(await Deno.readTextFile('config.json'));

const urlGen = (su: string) =>
	`${SCHEMA}://${CSE_IP}:${CSE_PORT}/cse-in${su}`;

const extractContent = ({ 'm2m:cin': { con } }: { 'm2m:cin': {[key: string]: string}, con:string}) => JSON.parse(con);

const get = async (url: string) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'X-M2M-Origin': 'CAdmin',
			'X-M2M-RI': '123456',
			'X-M2M-RVI': '3',
			'Accept': 'application/json'
		}
	});
	return res.json();
};

const getAllAE = async () => {
	const res = await get(urlGen('?rcn=6&ty=2'));
	const aes = res['m2m:rrl'].map((o: { [key: string]: string }) => o.nm).filter((ae: string) => ae != 'CAdmin');
	return aes;
};

async function getData(from: string) {
	const coordinates = extractContent(
		await get(urlGen(`/${from}/DESCRIPTOR/la`))
	);
	const gas = extractContent(await get(urlGen(`/${from}/DATA/la`)));
	const data = {
		coordinates,
		gas
	};
	return data;
}

app.get('/getData', async (req, res) => {
	console.time('request')
	const aes = await getAllAE();
	const data = await Promise.all(aes.map(getData));
	console.table(data);
	console.timeEnd('request')
	console.log();
	res.setStatus(201).json(data);
});

app.use(function (err:any, req:any, res:any, next:any) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
	console.log('Listening on port', PORT);
	console.log(`CSE at ${SCHEMA}://${CSE_IP}:${CSE_PORT}`);
	console.log();
});
