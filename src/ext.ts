const mi = {
	async reg(username: string, password: string) {
		const options = {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				username,
				password
			})
		};
		const res = await fetch('/api/mongo-register', options);

		if (res.status === 200) {
			console.debug(await res.text());
		}
	},
	async login(username: string, password: string) {
		const options = {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				username,
				password
			})
		};
		const res = await fetch('/api/mongo-login', options);

		if (res.status === 200) {
			console.debug(await res.text());
		}
	},
	async get() {
		const res = await fetch('/api/mongo-get', { headers: { token: 'aassddff' } });

		console.debug(await res.text());
	}
};

function replaceStorageWithObject(object: object) {
	localStorage.clear();
	for (const [key, value] of Object.entries(object)) {
		localStorage.setItem(key, value);
	}
}
