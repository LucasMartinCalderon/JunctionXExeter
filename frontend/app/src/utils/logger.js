import config from '../config';

const logger = (message, value = '') => {
	if (config.IS_DEV) {
		console.log(message, value)
	}
}

export default logger;