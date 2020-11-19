<template>
    <div>
        <b-button-group class="float-right">
            <b-button
                variant="outline-secondary"
                @click="$emit('delete-instance', instance)"
                v-b-tooltip.hover.top="'Delete this instance'">
                <font-awesome-icon icon="trash" />
            </b-button>
        </b-button-group>
        <b-button-group class="float-right mr-3">
            <b-button
                variant="outline-secondary"
                :disabled="instancesStatus[instance.id]"
                @click="$emit('start-instance', {instance: instance, host: host})">
                <font-awesome-icon icon="play" />
                Start
            </b-button>
            <b-button
                variant="outline-secondary"
                :disabled="!instancesStatus[instance.id]"
                @click="$emit('stop-instance', {instance: instance, host: host})">
                <font-awesome-icon icon="pause" />
                Stop
            </b-button>
        </b-button-group>
        <b-button-group class="float-right mr-3" v-if="instancesStatus[instance.id]">
            <b-button
                variant="outline-secondary"
                :disabled="!connected"
                @click="disconnect">
                <font-awesome-icon icon="bell-slash" />
            </b-button>
            <b-button
                variant="outline-secondary"
                :disabled="connected"
                @click="connect">
                <font-awesome-icon icon="bell" />
            </b-button>
        </b-button-group>
        <h3 class="py-3">
            <font-awesome-icon icon="circle"
                class="small"
                :class="instancesStatus[instance.id]? 'running' : 'not-running'" />
            {{ instance.configuration.name }}
            <small class="text-muted">
                <span v-if="instancesStatus[instance.id]">(instance running)</span>
                <span v-else>(instance not running)</span>
            </small>
        </h3>
        <b-row
            fluid
            v-if="instancesStatus[instance.id]">
            <b-col cols="3">
                <b-card>
                    <template #header>
                        <h6 class="mb-0">View configuration</h6>
                    </template>
                    <b-card-text>
                        <b-form-group>
                            <b-form-checkbox v-model="autoRefresh" switch>
                                Refresh on new values
                            </b-form-checkbox>
                        </b-form-group>
                        <b-form-group
                            :key="p.name"
                            v-for="p in instance.miner.viewParameters"
                            :label="p.name + ': (' + p.type + ')'">
                            <b-form-input
                                v-model="viewParameters[p.name]"
                                required
                                :placeholder="p.name"
                                debounce="500"
                                @update="parameterValueUpdated"></b-form-input>
                        </b-form-group>

                        <b-button
                            @click="updateViews"
                            v-if="!autoRefresh">
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
                            <font-awesome-icon icon="file-alt" v-if="v.type == 'RAW'" />
                            <font-awesome-icon icon="image" v-if="v.type == 'GRAPHVIZ'" />
                            <font-awesome-icon icon="download" v-if="v.type == 'BINARY'" />
                        </template>
                        <div
                            class="border w-100 p-2 raw-tab"
                            v-if="v.type == 'RAW'"
                            v-html="v.value">
                        </div>
                        <div v-if="v.type == 'GRAPHVIZ'">
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
                        <div v-if="v.type == 'BINARY'">
                            <b-button
                                :href="host + v.value"
                                target="_blank">
                                Download
                            </b-button>
                        </div>
                    </b-tab>
                </b-tabs>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
import Viz from "viz.js";
import workerURL from 'file-loader!viz.js/full.render.js';
import SvgPanZoom from "vue-svg-pan-zoom";

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
    name: 'InstanceViewer',
    props: ['instances','instancesStatus'],
    components: {
        SvgPanZoom
    },
    data() {
        return {
            host: null,
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
            autoRefresh: false,
            currentlyActiveTab: 0,

            connected: false
        }
    },
    created() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            this.viewParameters = {};
            this.views = [];
            this.dots = [];
            this.autoRefresh = false;
            if ('id' in this.$route.params) {
                if (this.$route.params.id in this.instances) {
                    this.instance = this.instances[this.$route.params.id];
                    this.host = this.$route.params.host;
                    this.disconnect();
                } else {
                    this.$router.push("/");
                }
            }
        },
        parameterValueUpdated() {
            if (this.autoRefresh) {
                this.updateViews();
            }
        },
        updateViews() {
            console.log(this.currentlyActiveTab);
            var config = [];
            for(const p in this.viewParameters) {
                config.push({name: p, value: this.viewParameters[p]});
            }
            axios.post(this.$minerServices.getInstanceView(this.host, this.instance.id), config)
                .then(res => {
                    this.views = res.data;
                    this.dots = [];
                    this.$toastr.s("Views updated successfully");
                })
                .catch(err => {
                    console.error(err);
                    this.$toastr.e("Error in updating views");
                });
        },
        activateTab(v) {
            if (v.type == "GRAPHVIZ") {
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
            var _this = this;
            this.socket = new SockJS(this.host + "/websockets");
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.connect({}, () => {
                    this.connected = true;
                    this.stompClient.subscribe("/" + _this.instance.id,  function(message) {
                        _this.$toastr.i(message.body);
                    });
                }, error => {
                    console.log(error);
                    this.connected = false;
                });
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
.running {
    color: rgb(0, 204, 0);
}

.not-running {
    color: rgb(170, 20, 20);
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
.raw-tab {
    height: calc(100vh - 250px);
    overflow: auto;
}
</style>