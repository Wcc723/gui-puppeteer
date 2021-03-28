export default {
  "url": "http://localhost:5000/order/create?coupon_code=2021_HEXSCHOOL_COUPON_2&order=bootstrap",
  "title": "金流頁面測試",
  "flow": [
    {
      "method": "waitForTimeout",
      "parameter": 1000
    },
    {
      "method": "click",
      "parameter": "#swiper-container > div.swiper-wrapper.pb-4 > label:nth-child(1)"
    },
    {
      "method": "waitForSelector",
      "parameter": "#Email"
    },
    {
      "method": "type",
      "parameter": ["#Email", "casper@hexschool.com"]
    },
    {
      "method": "type",
      "parameter": ["#Name", "卡斯伯"]
    },
    {
      "method": "waitForTimeout",
      "parameter": 1000
    },
    {
      "method": "click",
      "parameter": "body > div.container.mt-3 > div.ng-scope > form > div > div > div.order-card.relative > nav > button:nth-child(2)"
    },
    {
      "method":"click",
      "parameter": "body > div.container.mt-3 > div.ng-scope > form > div > div > div.order-card.relative > div.text-right.my-4 > button"
    },
    {
      "method": "waitForSelector",
      "parameter": "body > div.container.mt-3 > div.row.justify-content-center > div > form > div > button"
    },
    {
      "method":"click",
      "parameter": "body > div.container.mt-3 > div.row.justify-content-center > div > form > div > button"
    },
    {
      "method": "waitForTimeout",
      "parameter": 500
    },
    {
      "method":"waitForSelector",
      "parameter": "#confirm_send_order"
    },
    {
      "method":"click",
      "parameter": "#paytype_webatm",
      "comment": "Web ATM"
    },
    {
      "method":"waitForSelector",
      "parameter": "#confirm_send_order"
    },
    {
      "method":"click",
      "parameter": "#webatm_HNCB",
      "comment": "華南銀行"
    },
    {
      "method":"click",
      "parameter": "#show_pay_footer_m > div > div:nth-child(1) > label > input[type=checkbox]"
    },
    {
      "method":"click",
      "parameter": "#confirm_send_order"
    },
    {
      "method": "waitForSelector",
      "parameter": "body > div > div.d-flex.justify-content-center.mb-4 > a.fab.fab-line.mp-click.mx-1"
    }
  ]
}