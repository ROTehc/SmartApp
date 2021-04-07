import { opine, json } from 'https://deno.land/x/opine@1.2.0/mod.ts';
import { opineCors } from 'https://deno.land/x/cors/mod.ts';

const app = opine();

app.use(json());
app.use(opineCors());

const config = JSON.parse(await Deno.readTextFile('src/config.json'));

const urlGen = (su) =>
	`http://${config.CSE_URL}:${config.CSR_PORT}/cse-in${su}`;

const extractContent = ({ 'm2m:cin': { con } }) => JSON.parse(con);

const get = async (url) =>
	(
		await fetch(url, {
			method: 'GET',
			headers: {
				'X-M2M-Origin': 'CAdmin',
				'X-M2M-RI': 123456,
				'X-M2M-RVI': 3,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		})
	).json();

const getAllAE = async () =>
	(await get(urlGen('?rcn=6&ty=2')))['m2m:rrl']
		.map((o) => o.nm)
		.filter((o) => o != 'CAdmin');

async function getData(from) {
	const coordinates = extractContent(
		await get(urlGen(`/${from}/DESCRIPTOR/la`))
	);
	const gas = extractContent(await get(urlGen(`/${from}/DATA/la`)));
	return {
		coordinates,
		gas
	};
}

app.get('/getData', async (req, res) => {
	console.log(`${req.method} from ${req.ip} to ${req.url}`);
	const aes = await getAllAE();
	const data = await Promise.all(aes.map(getData));
	res.setStatus(201).json(data);
});

app.listen(config.PORT, () => {
	console.log('Listening on port', config.PORT);
	console.log('Current configuration:', config);
	console.log();
});
