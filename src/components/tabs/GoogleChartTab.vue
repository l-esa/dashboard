<template>
    <GChart
        :type="type"
        :data="data"
        :options="options"
        class="h-100"
        />
</template>

<script>
import { GChart } from 'vue-google-charts';

export default {
    name: 'GoogleChartTab',
    props: ['data','type','options'],
    components: {
        GChart
    }
}
</script>
