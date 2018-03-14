import Vue from 'vue';
import moment from 'moment'

/*filter for date format*/
Vue.filter('date', function (value) {
    if (value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
});
/*filter for truncate text*/
Vue.filter('truncate', function (text, stop, clamp) {
    if (text) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
});
