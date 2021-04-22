import toast from './toast.js';

export default {
  template: `<div class="toast-container position-fixed pe-3 end-0"
    style="z-index: 1000; top: 20px">
    <toast v-for="(msg, key) in messages" :key="key"
      :msg="msg"
    /></div>`,
  components: {
    toast,
  },
  data() {
    return {
      messages: [],
    };
  },
  inject: ['emitter'],
  mounted() {
    this.emitter.on('push-message', (message) => {
      const { style = 'success', title, content } = message;
      this.messages.push({ style, title, content });
    });
  },
}
