<template>
  <PieChart v-bind="pieChartProps" />
</template>

<script lang="ts">
import { Options, setup, Vue } from "vue-class-component";
import { computed } from "@vue/reactivity";
import { PieChart, usePieChart } from "vue-chart-3";
import { ChartData, ChartOptions } from "chart.js";

class Props {
  chartData!: ChartData<"pie">;
  chartOptions!: ChartOptions<"pie">;
}

function setUpGraph(chartData: ChartData<"pie">, chartOptions: ChartOptions<"pie">) {
  const data = computed<ChartData<"pie">>(() => chartData);

  const options = computed<ChartOptions<"pie">>(() => chartOptions);

  const { pieChartProps, pieChartRef } = usePieChart({
    chartData: data,
    options,
  });

  return {
    pieChartProps,
    pieChartRef,
  };
}

@Options({
  components: {
    PieChart,
  },
})
export default class PiePieChart extends Vue.with(Props) {
  chart = setup(() => setUpGraph(this.chartData, this.chartOptions));
}
</script>
