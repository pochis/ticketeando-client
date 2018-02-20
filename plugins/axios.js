import Cookie from 'js-cookie';

export default function ({ $axios, redirect }) {
 $axios.defaults.headers.common['Authorization'] = 'Bearer '+ Cookie.get('token');
 
}
