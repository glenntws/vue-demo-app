<script setup lang="ts">

import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, type PluginOptionsByType, TimeScale, TimeSeriesScale } from 'chart.js'
import type { PropType } from "vue";
import 'chartjs-adapter-date-fns';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, TimeSeriesScale)

defineProps({
  cssClasses: {
    default: '',
    type: String
  },
  styles: {
    type: Object as PropType<Partial<CSSStyleDeclaration>>,
    default: () => {}
  },
  plugins: {
    type: Object as PropType<PluginOptionsByType<"line">>,
    default: () => {}
  },
  chartData: {
    default: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
    }
  },
  chartOptions: {
    default: {
      responsive: true,
    }
  }
});
</script>

<template>
    <Line
        :chart-options="chartOptions"
        :chart-data="chartData"
        :css-classes="cssClasses"
        :plugins="plugins"
        :styles="styles"
    />
</template>