import axios from 'axios';

import Aspects from '@/aspects';

const cosmosHttp = axios.create({
	baseURL: '/cosmos-api'
});

const authHttp = axios.create({
	baseURL: '/api',
	validateStatus: function (status) {
		return (status >= 200 && status < 300) || (status === 401 || status === 403);
	},
});

export default {

	getAuthUser() {
		return authHttp.get('/auth/session')
			.then(res => res.data && res.data.success ? res.data.user : null);
	},

	logoutUser() {
		return authHttp.delete('/auth/session')
			.then(res => res.data);
	},

	getProjects() {
		return cosmosHttp.get('/projects')
			.then(res => res.data.projects);
	},

	getProject(id) {
		return cosmosHttp.request(`/projects/${id}`)
			.then(res => res.data.project)
			.then(project => Aspects.populateProject(project));
	},

	createProject(params) {
		return cosmosHttp.post('/projects', params)
			.then(res => res.data.id);
	},

	saveProject(id, params) {
		return cosmosHttp.put(`/projects/${id}`, params)
			.then(res => res.data)
			.catch(e => {
				return e && e.response && e.response.data ? e.response.data : false;
			});
	},

	uploadImage(formData) {
		var endpoint = '/upload-image';
		return cosmosHttp.post(endpoint, formData)
			.then(res => res.data);
	}

}
