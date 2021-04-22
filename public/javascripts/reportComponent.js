import firebaseRefs from './databaseRefs.js';

export default {
  template: `<div class="alert alert-secondary mt-3" v-if="data.title"
    style="max-height: 600px; overflow-y: auto">
    <h5>站點：{{ data.host }}</h5>
    <h5>測試名稱：{{ data.title }}</h5>
    <ul>
      <li v-for="(item, key) in data.log" :key="key">
      {{ new Date(item.timestamp) }} - {{ item.message }}
      </li>
    </ul>
  </div>`,
  setup() {
    const data = Vue.ref({
      title: ''
    });
    const emitter = Vue.inject('emitter');
    console.log(emitter);
    Vue.onMounted(() => {
      emitter.on('get-logs', (id) => {
        console.log('get-logs', id);
        firebaseRefs.logsRef.child(id).on('value', (snapshot) => {
          data.value = snapshot.val() || {};
        })
      });
    });

    return {
      data,
    }
  }
}
