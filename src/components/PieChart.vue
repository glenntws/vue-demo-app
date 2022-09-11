<script setup lang="ts">

    import { Pie } from "vue-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, type PluginOptionsByType } from 'chart.js'
    import type { PropType } from "vue";
    
    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)
    
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
            datasets: [
                { data: [40, 20, 60] }
            ]
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
        <Pie
            :chart-options="chartOptions"
            :chart-data="chartData"
            :css-classes="cssClasses"
            :plugins="plugins"
            :styles="styles"
        />
    </template>