/**
 * Custom axios service that:
 * - Checks that response format is application/json
 * - Returns the data field of the response
 * 
 * Use this with any calls you are making to the Strapi API.
 */

import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(function (response) {
	if (response.headers['content-type'].indexOf('application/json') !== -1) {
		return response.data;
	}
	return Promise.reject(new Error('Response was not application/json'));
}, function (error) {
	return Promise.reject(error);
})

export default instance;