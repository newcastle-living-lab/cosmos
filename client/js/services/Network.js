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

	deleteProject(id) {
		return cosmosHttp.delete(`/projects/${id}`)
			.then(res => res.data)
	},

	uploadImage(projectId, formData) {
		return cosmosHttp.post(`/upload-image/${projectId}`, formData)
			.then(res => res.data);
	},

	exportProject(id) {
		return cosmosHttp.post(`export-project/${id}`)
			.then(res => res.data)
	},

	importProject(formData) {
		return cosmosHttp.post('import-project', formData)
			.then(res => res.data)
	},

	getLogos() {
		return authHttp.get('/logos')
			.then(res => res.data);
	}

}
