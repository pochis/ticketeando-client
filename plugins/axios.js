import Cookie from 'js-cookie';
export default function ({ store,$axios, redirect,inject }) {
 $axios.defaults.baseURL = 'http://ticketeando-server-pochis852.c9users.io/api/v1/';
 $axios.defaults.headers.common['api-key'] = store.state.apikey;
}
