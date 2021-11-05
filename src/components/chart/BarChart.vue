<template>
  <BarChart v-bind="barChartProps" />
</template>

<script lang="ts">
import { Options, setup, Vue } from "vue-class-component";
import { computed } from "@vue/reactivity";
import { BarChart, useBarChart } from "vue-chart-3";
import { ChartData, ChartOptions } from "chart.js";

class Props {
  chartData!: ChartData<"bar">;
  chartOptions!: ChartOptions<"bar">;
}

function setUpGraph(chartData: ChartData<"bar">, chartOptions: ChartOptions<"bar">) {
  const data = computed<ChartData<"bar">>(() => chartData);

  const options = computed<ChartOptions<"bar">>(() => chartOptions);

  const { barChartProps, barChartRef } = useBarChart({
    chartData: data,
    options,
  });

  return {
    barChartProps,
    barChartRef,
  };
}

@Options({
  components: {
    BarChart,
  },
})
export default class BarBarChart extends Vue.with(Props) {
  chart = setup(() => setUpGraph(this.chartData, this.chartOptions));
}
</script>