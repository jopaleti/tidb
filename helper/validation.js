
const isEmpty = (input) => {
	if (input === undefined || input === "") {
		return true;
	}
	if (input.replace(/\s/g, "").length) {
		return false;
	}
	return true;
};

export { isEmpty };
