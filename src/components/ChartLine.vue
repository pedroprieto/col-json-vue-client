<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'ChartLine',
  extends: Line,
  props: ['item'],
  mounted: function () {
    var chartdata = this.item.data.filter(d => {
      return d.name == 'data'
})[0].value;
    var options = this.item.data.filter(d => {
      return d.name == 'options'
})[0].value;
    var options = JSON.parse(options);
    options.maintainAspectRatio = false;
    this.renderChart(JSON.parse(chartdata), options)
  }
}
</script>
