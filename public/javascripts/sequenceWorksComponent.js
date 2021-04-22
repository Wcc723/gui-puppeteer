import firebaseRefs from '/javascripts/databaseRefs.js';

export default {
  props: {
    works: Object,
    sequenceWorks: Object,
  },
  setup(props) {
    const tempWorks = Vue.ref([]);
    const work = Vue.ref({});
    const emitter = Vue.inject('emitter');
    Vue.watch(props.sequenceWorks, (first, second)=> {
      tempWorks.value = props.sequenceWorks.works.map(item => {
        return {
          timestamp: item.timestamp,
          ...props.works[item.id]
        };
      });
      work.value = { ...props.sequenceWorks }
    })

    function startMultiTest() {
      const timestamp = new Date().getTime();
      console.log(tempWorks.value);
      emitter.emit('get-logs', timestamp);
      axios.post('/multi-start', {
        works: tempWorks.value,
        timestamp,
      })
        .then(res=> {
          console.log(res);
        })
    }

    function removeWork(work) {
      tempWorks.value.forEach((item, key) => {
        if (item.timestamp === work.timestamp) {
          tempWorks.value.splice(key, 1);
        }
      })
    }

    function saveSequenceWorks() {
      // work = props.sequenceWorks;
      if (!work.value.id) {
        work.value.id = firebaseRefs.sequenceWorksRef.push().key;
      }
      firebaseRefs.sequenceWorksRef.child(work.value.id)
        .set(work.value);
    }


    return {
      tempWorks,
      work,
      startMultiTest,
      saveSequenceWorks,
      removeWork,
    }
  },
  template: `<h2>序列任務</h2>
  <div class="list-group list-group-flush">
  <div class="form-floating mb-3">
    <input type="text" class="form-control" v-model="work.title">
    <label>標題</label>
  </div>
  <draggable :list="tempWorks" item-key="timestamp"
             @start="dragging = true"
             @end="dragging = false">
    <template #item="{element}">
    <div class="list-group-item">
      <div class="input-group input-group-sm d-inline-flex w-auto me-2">
        <button type="button" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-grip-vertical"></i>
        </button>
        <button class="btn btn-outline-danger" type="button" @click="removeWork(element)">
          <i class="bi bi-x"></i>
        </button>
      </div>   
      {{ element.title }}
    </div>
    </template>
  </draggable>
  </div>
  <div class="input-group input-group-sm justify-content-end mt-3">
    <button type="button" class="btn btn-outline-primary"
      @click="saveSequenceWorks">儲存序列</button>
    <button type="button" class="btn btn-outline-success"
      @click="startMultiTest">執行序列工作</button>
  </div>`
}
