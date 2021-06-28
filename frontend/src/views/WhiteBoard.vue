<template>
  <div>
    <h5>当前第：{{ page }} 页</h5>
    <div id="zwibbler" style="margin-left:auto;margin-right:auto;border:2px solid red;width:700px;height:500px;"></div>
    <div>
      <md-button class="md-raised md-primary" @click='previousPage'>上一页</md-button>
      <md-button class="md-raised md-accent" @click='nextPage'>下一页</md-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Whiteboard',
  data: function () {
    return {
      zwibbler: null,
      page: 1
    }
  },
  methods: {
    nextPage: function () {
      this.zwibbler.nextPage()
      this.page++;
    },
    previousPage: function () {
      this.zwibbler.previousPage()
      this.page--;
    }
  },
  mounted() {
    this.$loadScript('http://zwibbler.com/zwibbler-demo.js').then(() => {
      /* eslint-disable */
      var zwibbler = Zwibbler.create('zwibbler', {
        showPropertyPanel: true,
        showShapeBrushTool: true,
        showColourPanel: false
      })
      this.zwibbler = zwibbler
      this.zwibbler.addPage();
      this.zwibbler.addPage();
      this.zwibbler.addPage();
    })
  }
}
</script>
