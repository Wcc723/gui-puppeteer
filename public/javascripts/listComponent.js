import pupeteerMethods from '/javascripts/puppeteer-metods.js';
import firebaseRefs from '/javascripts/databaseRefs.js';

export default {
  data() {
    return {
      work: {
        host: '',
        query: '',
        title: '',
        flows: []
      },
      arrays: [{id:1}, {id:2}, {id: 3}],
      pupeteerMethods,
    };
  },
  methods: {
    updateMethod(flow) {
      if (this.pupeteerMethods[flow.method]?.parameterType === 'array') {
        flow.parameter = ['', ''];
      }
    },
    addFlow() {
      this.work.flows.push({
        id: new Date().getTime(),
      });
    },
    removeFlow(flow) {
      console.log('removeFlow');
      this.work.flows.forEach((item, i)=> {
        // TODO: 需要改成使用 id
        if (item === flow) {
          console.log(item);
          this.work.flows.splice(i, 1);
        }
      })
    },
    saveWorker() {
      if (!this.work.id) {
        this.work.id = refs.workerRef.push().key;
      }
      refs.workerRef.child(this.work.id).set(this.work);
    },
    startTesting() {
      axios.post('/start-test', this.work)
        .then(res => {
          console.log(res);
        })
    },
  },
  created() {
    const defaultWorkId = '-MWqoIazkNF6Hb6gfq2T';
    firebaseRefs.workerRef.child(defaultWorkId).on('value', (snapshot) => {
      this.work = snapshot.val();
      console.log(this.work);
    })
  },
  template: `<div class="row">
    <div class="col">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" v-model="work.host">
        <label>站點</label>
      </div>
    </div>
    <div class="col">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" v-model="work.query">
        <label>路徑</label>
      </div>
    </div>
    <div class="col">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" v-model="work.title">
        <label>標題</label>
      </div>
    </div>
  </div>
  <hr>
  <draggable :list="work.flows" item-key="id"
             @start="dragging = true"
             @end="dragging = false">
    <template #item="{element}">
      <div class="row gx-2">
        <div class="col-4">
          <div class="input-group">
            <button class="btn btn-outline-secondary" type="button">
              <i class="bi bi-grip-vertical"></i>
            </button>
            <button class="btn btn-outline-danger" @click="removeFlow(element)" type="button">
              <i class="bi bi-x"></i>
            </button>
            <div class="form-floating flex-fill">
              <select class="form-select"
                      v-model="element.method"
                      @change="updateMethod(element)"
              >
                <option :value="item.name" v-for="item in pupeteerMethods"
                        :key="item.name">
                  {{ item.name }}
                  {{ item.description }}
                </option>
              </select>
              <label>請選擇一個項目</label>
            </div>
          </div>
        </div>
        <div class="col-5"><!-- 參數 -->
          <!-- 當方法不為陣列 -->
          <div class="form-floating mb-3"
            v-if="pupeteerMethods[element.method]?.parameterType !== 'array'
            && pupeteerMethods[element.method]">
            <input type="text" class="form-control"
            v-if="pupeteerMethods[element.method]?.parameterType === 'string'" v-model="element.parameter">
            <input type="text" class="form-control"
            v-else-if="pupeteerMethods[element.method]?.parameterType === 'number'" v-model.number="element.parameter">
            <label for="floatingInput">{{ pupeteerMethods[element.method].parameterDescription }}</label>
          </div>

          <!-- 當方法為陣列 -->
          <div class="row" v-if="pupeteerMethods[element.method]?.parameterType === 'array'
            && element?.parameter?.length">
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="element.parameter[0]">
                <label>{{ pupeteerMethods[element.method].parameterDescription[0] }}</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="element.parameter[1]">
                <label>{{ pupeteerMethods[element.method].parameterDescription[1] }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-3">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" v-model="element.message">
            <label>回饋訊息</label>
          </div>
        </div>
      </div>
    </template>
  </draggable>
  <div v-if="work?.flows?.length">
    <button
      v-if="work?.flows[work?.flows?.length - 1]?.method"
      type="button" @click="addFlow" class="btn btn-secondary d-block w-100">
      新增項目
    </button>
  </div>
  <div class="text-end mt-3">
    <button class="btn btn-outline-success me-2" @click="saveWorker">儲存工作</button>
    <button class="btn btn-primary" type="button" @click="startTesting">
      開始測試
    </button>
  </div>`
}
