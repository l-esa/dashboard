<template>
    <div>
        <b-button-group class="mt-3 float-right">
            <b-button
                variant="outline-secondary"
                @click="$emit('delete-instance', instance)"
                v-b-tooltip.hover.top="'Delete this instance'">
                <font-awesome-icon icon="trash" />
            </b-button>
        </b-button-group>
        <b-button-group class="float-right mr-3 mt-3">
            <b-button
                variant="outline-secondary"
                :disabled="instancesStatus[instance.id] != 'not_mining'"
                @click="$emit('start-instance', {instance: instance, host: host})">
                <font-awesome-icon icon="play" />
                Start
            </b-button>
            <b-button
                variant="outline-secondary"
                :disabled="instancesStatus[instance.id] != 'mining'"
                @click="$emit('stop-instance', {instance: instance, host: host})">
                <font-awesome-icon icon="pause" />
                Stop
            </b-button>
        </b-button-group>
        <h3 class="py-3">
            <font-awesome-icon icon="circle"
                class="small"
                :class="instancesStatus[instance.id]" />
            {{ instance.configuration.name }}
            <small class="text-muted">
                <span v-if="instancesStatus[instance.id] == 'mining'">(instance running)</span>
                <span v-if="instancesStatus[instance.id] == 'not_mining'">(instance not running)</span>
                <span v-if="instancesStatus[instance.id] == 'configuring'">(instance being prepared)</span>
            </small>
        </h3>
        <b-row
            fluid
            v-if="instancesStatus[instance.id] == 'mining'">
            <b-col cols="3">
                <b-card>
                    <template #header>
                        <h6 class="mb-0">View configuration</h6>
                    </template>
                    <b-card-text>
                        <b-form-group
                            :key="p.name"
                            v-for="p in instance.miner.viewParameters"
                            :label="p.name + ':'">
                            <vue-slider
                                v-if="p.type.toLowerCase() == 'range_0_1'"
                                v-model="viewParameters[p.name]"
                                :min='0'
                                :max='1'
                                :interval='0.01'
                                :default='0.5'
                                :lazy="true"
                                @change="parameterValueUpdated"></vue-slider>
                            <b-form-input
                                v-else
                                v-model="viewParameters[p.name]"
                                required
                                :placeholder='p.name + " (" + p.type + ")"'
                                debounce="500"
                                @update="parameterValueUpdated"></b-form-input>
                        </b-form-group>

                        <b-form-checkbox
                            v-model="updateOnNewValue"
                            switch
                            class="mt-3">
                            Update on new value
                        </b-form-checkbox>
                        <b-button
                            v-if="!updateOnNewValue"
                            @click="updateViews"
                            class="mt-2">
                            Update view
                        </b-button>
                    </b-card-text>
                </b-card>
            </b-col>
            <b-col cols="9">
                <b-tabs
                    v-model="currentlyActiveTab"
                    content-class="mt-3">
                    <b-tab
                        v-bind:key="v.name"
                        v-for="v in views"
                        @click="activateTab(v)">
                        <template #title>
                            {{ v.name }}
                            <font-awesome-icon icon="file-alt" v-if="v.type.toLowerCase() == 'raw'" />
                            <font-awesome-icon icon="image" v-if="v.type.toLowerCase() == 'graphviz'" />
                            <font-awesome-icon icon="download" v-if="v.type.toLowerCase() == 'binary'" />
                            <font-awesome-icon icon="table" v-if="v.type.toLowerCase() == 'google'" />
                        </template>
                        <div
                            class="border w-100 p-2 raw-tab"
                            v-if="v.type.toLowerCase() == 'raw'"
                            v-html="v.value">
                        </div>
                        <div v-if="v.type.toLowerCase() == 'graphviz'">
                            <SvgPanZoom
                                class="border w-100 svg-panzoom"
                                :class="{ 'loading' : !(v.name in dots) }"
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
                                    <g class="svg-pan-zoom_viewport" v-html="dots[v.name]"></g>
                                </svg>
                            </SvgPanZoom>
                        </div>
                        <div v-if="v.type.toLowerCase() == 'binary'">
                            <p>File: 
                                <code v-if="v.value.startsWith('http')" v-html="v.value" />
                                <code v-if="!v.value.startsWith('http')" v-html="host + v.value" />
                            </p>
                            <b-button
                                v-if="v.value.startsWith('http')"
                                :href="v.value"
                                target="_blank">
                                Download
                            </b-button>
                            <b-button
                                v-if="!v.value.startsWith('http')"
                                :href="host + v.value"
                                target="_blank">
                                Download
                            </b-button>
                        </div>
                        <div
                            v-if="v.type.toLowerCase() == 'google'"
                            class="border w-100 gchart">
                            <GChart
                                :type="v.value.type"
                                :data="v.value.data"
                                :options="v.value.options"
                                class="h-100"
                                />
                        </div>
                    </b-tab>
                </b-tabs>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import Viz from "viz.js";
import workerURL from 'file-loader!viz.js/full.render.js';
import SvgPanZoom from "vue-svg-pan-zoom";
import VueSlider from 'vue-slider-component'
import { GChart } from 'vue-google-charts';

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
    name: 'InstanceViewer',
    props: ['instances','instancesStatus','host','instanceId'],
    components: {
        SvgPanZoom, GChart, VueSlider
    },
    data() {
        return {
            instance: {
                id: '',
                configuration: {
                    name: null
                },
                miner: {
                    viewParameters: []
                }
            },
            viewParameters: {},
            views: [],
            dots: [],
            currentlyActiveTab: 0,
            
            updateOnNewValue: false,

            connected: false,
            latestViewUpdateFetched: null // this data object keeps track of the last time a request to refreshing the view was made, to avoid flooding the system
        }
    },
    created() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData',
        instancesStatus : {
            handler() {
                if (this.instancesStatus[this.instance.id]) {
                    this.connect();
                } else {
                    this.disconnect();
                }
            },
            deep: true
        }
    },
    methods: {
        fetchData() {
            this.disconnect();
            this.viewParameters = {};
            this.views = [];
            this.dots = [];
            this.updateOnNewValue = false;
            if (this.instances[this.instanceId] !== undefined) {
                this.instance = this.instances[this.instanceId];
            } else {
                this.$router.push("/");
            }
        },
        parameterValueUpdated() {
            console.log(this.updateOnNewValue);
            if (this.updateOnNewValue) {
                
                this.updateViews();
            }
        },
        updateViews(notifyUpdate = true) {
            // avoid flooding the system
            var currentTime = new Date().getTime();
            if ((currentTime - this.latestViewUpdateFetched) < 1000) {
                return;
            }
            this.latestViewUpdateFetched = new Date().getTime();

            // perform the actual update of the view
            console.log(this.currentlyActiveTab);
            var config = [];
            for(const p in this.viewParameters) {
                config.push({name: p, value: this.viewParameters[p]});
            }
            axios.post(this.$minerServices.getInstanceView(this.host, this.instance.id), config)
                .then(res => {
                    this.views = res.data;
                    this.dots = [];
                    if (notifyUpdate) {
                        this.$toastr.s("Views updated successfully");
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$toastr.e("Error in updating views");
                });
        },
        activateTab(v) {
            if (v.type.toLowerCase() == "graphviz") {
                if (!(v.name in this.dots)) {
                    var viz = new Viz({ workerURL });
                    viz.renderSVGElement(v.value)
                        .then(element => {
                            this.viewBox = element.getAttribute("viewBox").split(" ").map(Math.ceil);
                            let innerHTML = element.getElementsByClassName("graph")[0].innerHTML;
                            this.$set(this.dots, v.name, innerHTML);
                        })
                        .catch(error => {
                            this.$toastr.e("Error while rendering the graph");
                            console.error(error);
                        });
                }
            }
        },
        registerSvgPanZoom(svgpanzoom) {
            this.svgpanzoom = svgpanzoom;
        },
        connect() {
            if (this.instancesStatus[this.instance.id]) {
                var _this = this;
                this.socket = new SockJS(this.host + "/websockets");
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.connect({}, () => {
                        this.connected = true;
                        this.stompClient.subscribe("/" + _this.instance.id,  function(message) {
                            var msg = JSON.parse(message.body);
                            if (msg.type.toLowerCase() == 'refresh') {
                                _this.updateViews(false);
                            } else if (msg.type.toLowerCase() == 'toastr') {
                                _this.$toastr.i(_.escape(msg.text));
                            }
                        });
                    }, error => {
                        console.log(error);
                        this.connected = false;
                    });
            }
        },
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
            this.connected = false;
        }
    }
}
</script>

<style scoped>
.mining {
  color: rgb(0, 204, 0);
}

.not_mining {
  color: rgb(170, 20, 20);
}

.configuring {
  color: rgb(180, 141, 56);
}

.loading {
	background: url('../assets/loader.svg') center center no-repeat !important;
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
.gchart {
    background-color: #fff;
    overflow: hidden;
    margin-top: 1rem;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 250px);
}
.raw-tab {
    height: calc(100vh - 250px);
    overflow: auto;
}
</style>