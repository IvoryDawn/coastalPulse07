import 'dotenv/config';

const API = process.env.API || 'http://localhost:4000';

async function post(path, body) {
	const res = await fetch(`${API}${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
	const text = await res.text();
	let parsed;
	try { parsed = JSON.parse(text); } catch { parsed = text; }
	return { status: res.status, body: parsed };
}

(async () => {
	const email = `test${Date.now()}@example.com`;
	const password = 'pass1234';

	console.log('Registering user', email);
	const reg = await post('/api/auth/register', {
		name: 'Test User',
		email,
		password,
		role: 'citizen'
	});
	console.log('Register response:', reg.status, reg.body);

	console.log('Logging in...', email);
	const login = await post('/api/auth/login', { email, password });
	console.log('Login response:', login.status, login.body);
})();
