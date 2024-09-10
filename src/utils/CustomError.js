class CustomError extends Error {
	constructor(errorCode) {
		super(errorCode.message);
		this.code = errorCode.code;
		this.statusCode = errorCode.statusCode;
	}
}

module.exports = CustomError;
