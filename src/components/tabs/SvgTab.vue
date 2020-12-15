<template>
    <SvgPanZoom
        class="border w-100 svg-panzoom"
        :class="{ 'loading' : !(svg) }"
        :viewportSelector="`.graph`"
        :zoomEnabled="true"
        :controlIconsEnabled="true"
        :panEnabled="true"
        :fit="false"
        :center="true"
        :minZoom="0.1"
        :maxZoom="3"
        @svgpanzoom="registerSvgPanZoom">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g class="graph svg-pan-zoom_viewport" v-html="svg" />
        </svg>
    </SvgPanZoom>
</template>

<script>
import Viz from "viz.js";
import workerURL from 'file-loader!viz.js/full.render.js';
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
    name: 'SvgTab',
    props: ['value'],
    components: {
        SvgPanZoom
    },
    data() {
        return {
            svg: null
        };
    },
    watch: {
        'value': 'update'
    },
    methods: {
        registerSvgPanZoom(svgpanzoom) {
            this.svgpanzoom = svgpanzoom;
        },
        update() {
            var viz = new Viz({ workerURL });
            this.svg = null;
            viz.renderSVGElement(this.value)
                .then(element => {
                    this.viewBox = element.getAttribute("viewBox").split(" ").map(Math.ceil);
                    let innerHTML = element.getElementsByClassName("graph")[0].innerHTML;
                    this.svg = innerHTML;
                })
                .catch(error => {
                    this.$toastr.e("Error while rendering the graph");
                    console.error(error);
                });
        }
    },
    mounted: function() {
        this.update();
    }
}
</script>

<style scoped>
.loading {
	background: url('../../assets/loader.svg') center center no-repeat !important;
}
.svg-panzoom {
    background-color: #fff;
    /* overflow: hidden; */
    margin-top: 1rem;
    top: 0;
    left: 0;
    width: 100%;
}
.svg-panzoom svg {
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 250px);
    /* overflow: hidden; */
}
</style>