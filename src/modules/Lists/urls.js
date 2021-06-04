// URLs for Tasks App
import {API_URL} from "../../app/urls";

//todo move into static class, together with static methods for crud methods
export const TASKS_API_URL = `${API_URL}/tasks/`;
export const TASKLISTS_URL = `${TASKS_API_URL}tasklists/`;
export const getTasklistUrl = id => `${TASKLISTS_URL}${id}/`;
export const getTasksUrl = tasklist => `${TASKLISTS_URL}${tasklist}/tasks/`;
export const getTaskUrl = (id, tasklist) => `${getTasksUrl(tasklist)}${id}/`;
