import firebaseRefs from '/javascripts/databaseRefs.js';

export default {
  emits: ['update-sequence-works'],
  setup() {
    const list = Vue.ref([]);

    Vue.onMounted(() => {
      firebaseRefs.sequenceWorksRef.on('value', (snapshot) => {
        list.value = snapshot.val();
        console.log(list.value);
      });
    });

    function removeSequenceWorks(item) {
      if (confirm(`移除 ${item.title}`)) {
        firebaseRefs.sequenceWorksRef.child(item.id).remove()
      }
    }

    return {
      list,
      removeSequenceWorks
    }
  },
  template: `<h2>序列列表</h2>
  <div class="mb-5 clearfix" style="overflow-x: auto">
    <div class="card float-start me-2" style="width: 18rem" v-for="item in list">
      <div class="card-body">
        <h5 class="card-title">{{ item.title }}</h5>
        <p class="card-text">共用 {{ item.works.length }} 個工作</p>
        <button type="button" class="btn btn-outline-primary btn-sm me-2"
          @click="$emit('update-sequence-works', item)">
          套用序列工作
        </button>
        <button type="button" class="btn btn-outline-danger btn-sm"
          @click="removeSequenceWorks(item)">
          移除序列工作
        </button>
      </div>
    </div>
  </div>
  `
}
