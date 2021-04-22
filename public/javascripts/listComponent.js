import firebaseRefs from './databaseRefs.js';
import sequenceWorksComponent from './sequenceWorksComponent.js';
import sequenceWorksLists from './sequenceWorksLists.js';
import reportComponent from './reportComponent.js';

export default {
  components: {
    sequenceWorksComponent,
    sequenceWorksLists,
    reportComponent,
  },
  setup() {
    const list = Vue.ref([]);
    const sequenceWorks = Vue.ref({
      title: '',
      works: []
    });
    const emitter = Vue.inject('emitter');

    function startWorker(item) {
      const timestamp = new Date().getTime();
      const work = {
        ...item,
        timestamp
      }
      emitter.emit('get-logs', work.timestamp);
      axios.post('/start-test', work)
        .then(res => {
          // TODO: 為什麼不會動
          emitter.emit('push-message', {
            title: res.data.success ? '運行完成' : '運行失敗',
            style: res.data.success ? 'success' : 'danger',
            content: res.data.message
          });
        })
    }

    function removeWorker(work) {
      console.log(work);
      if (window.confirm(`移除 "${work.title}" 工作項`)) {
        firebaseRefs.workerRef.child(work.id).remove();
      }
    }

    function addWorkToSequence(item) {
      sequenceWorks.value.works.push({
        timestamp: new Date().getTime(),
        id: item.id
      });
    }

    // emits from 'sequenceWorksLists'
    function updateSequenceWorks(item) {
      // 強制觸發另一邊元件的 watch
      sequenceWorks.value.id = item.id;
      sequenceWorks.value.title = item.title;
      sequenceWorks.value.works = item.works
      console.log(sequenceWorks.value);
    }

    Vue.onMounted(() => {
      firebaseRefs.workerRef.on('value', (snapshot) => {
        list.value = snapshot.val();
      });
    });

    return {
      list,
      sequenceWorks,
      startWorker,
      removeWorker,
      addWorkToSequence,
      updateSequenceWorks,
    };
  },
  template: `
  <sequenceWorksLists @update-sequence-works="updateSequenceWorks"></sequenceWorksLists>
  <div class="row">
    <div class="col-md-8">
      <h2>工作任務表</h2>
      <div class="d-flex justify-content-end">
        <router-link class="btn btn-outline-primary" to="/worker">新增</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名稱</th>
            <th>預設站點</th>
            <th>路徑</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              {{ item.title }}
            </td>
            <td>{{ item.host }}</td>
            <td><div 
              class="text-truncate" style="width: 150px">
              {{ item.query }}</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-danger" @click="removeWorker(item)">刪除</button>
                <router-link class="btn btn-outline-primary" :to="'/worker/' + item.id">編輯</router-link>
                <button type="button" class="btn btn-outline-primary" @click="startWorker(item)">開始測試</button>
              </div>
              <button type="button" class="btn btn-outline-primary btn-sm ms-2" @click="addWorkToSequence(item)">加入序列</button>
            </td>
          </tr>
        </tbody>
      </table> 
    </div>
    <div class="col-md-4">
      <sequence-works-component
        :sequence-works="sequenceWorks"
        :works="list"></sequence-works-component>
    </div>
  </div>
  <reportComponent></reportComponent>
  `
};
