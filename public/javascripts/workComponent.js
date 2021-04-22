import puppeteerMethods from '/javascripts/puppeteer-metods.js';
import firebaseRefs from '/javascripts/databaseRefs.js';
import reportComponent from './reportComponent.js';

export default {
  data() {
    return {
      work: {
        host: '',
        query: '',
        title: '',
        flows: [{}]
      },
      arrays: [{id:1}, {id:2}, {id: 3}],
      puppeteerMethods,
    };
  },
  components: {
    reportComponent,
  },
  inject: ['emitter'],
  methods: {
    updateMethod(flow) {
      if (this.puppeteerMethods[flow.method]?.parameterType === 'array') {
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
        this.work.id = firebaseRefs.workerRef.push().key;
      }
      firebaseRefs.workerRef.child(this.work.id).set(this.work);
    },
    startTesting() {
      const timestamp = new Date().getTime();
      const work = {
        ...this.work,
        timestamp
      }
      this.emitter.emit('get-logs', work.timestamp);
      axios.post('/start-test', work)
        .then(res => {
          this.emitter.emit('push-message', {
            title: res.data.success ? '運行完成' : '運行失敗',
            style: res.data.success ? 'success' : 'danger',
            content: res.data.message
          });
        })
    },
  },
  created() {
    const id = this.$route.params.id;
    console.log(this.$route.params);
    if (id) {
      firebaseRefs.workerRef.child(id).on('value', (snapshot) => {
        this.work = snapshot.val();
        if (!this.work.flows) {
          this.work.flows = [{}];
        }
      });
    }
    console.log(this.emitter);
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
                <option :value="item.name" v-for="item in puppeteerMethods"
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
            v-if="puppeteerMethods[element.method]?.parameterType === 'string'
            || puppeteerMethods[element.method]?.parameterType === 'number'">
            <input type="text" class="form-control"
            v-if="puppeteerMethods[element.method]?.parameterType === 'string'" v-model="element.parameter">
            <input type="text" class="form-control"
            v-else-if="puppeteerMethods[element.method]?.parameterType === 'number'" v-model.number="element.parameter">
            <label for="floatingInput">{{ puppeteerMethods[element.method].parameterDescription }}</label>
          </div>
          <!-- 當為固定方法 -->
          <div v-else-if="puppeteerMethods[element.method]?.parameterType === 'static'">
            <div class="form-floating flex-fill">
              <select class="form-select" v-model="element.parameter">
                <option value="" disabled selected>請選擇</option>
                <option :value="puppeteerMethods[element.method].parameterContent">
                  {{ puppeteerMethods[element.method].parameterContent }}
                </option>
              </select>
              <label>請選擇固定選項</label>
            </div>
          </div>
          <!-- 當為沒有項目需要填寫 -->
          <div v-else-if="puppeteerMethods[element.method]?.parameterType === 'none'">
            <div class="form-floating flex-fill">
              不需選擇
            </div>
          </div>
          <!-- 當方法為陣列 -->
          <div class="row" v-else-if="puppeteerMethods[element.method]?.parameterType === 'array'
            && element?.parameter?.length">
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="element.parameter[0]">
                <label>{{ puppeteerMethods[element.method].parameterDescription[0] }}</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="element.parameter[1]">
                <label>{{ puppeteerMethods[element.method].parameterDescription[1] }}</label>
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
  <div class="d-flex justify-content-end mt-3">
    <router-link class="btn btn-outline-secondary me-auto" to="/list">返回前頁</router-link>
    <button class="btn btn-outline-success me-2" @click="saveWorker">儲存工作</button>
    <button class="btn btn-primary" type="button" @click="startTesting">
      開始測試
    </button>
  </div>
  <reportComponent></reportComponent>`
}
