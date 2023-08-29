function replaceStorageWithObject(object: object) {
	localStorage.clear();
	for (const [key, value] of Object.entries(object)) {
		localStorage.setItem(key, value);
	}
}