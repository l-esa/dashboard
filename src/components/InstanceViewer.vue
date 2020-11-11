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
        <b-tabs
            v-if="instancesStatus[instance.id]"
            content-class="mt-3">
            <b-tab active>
                <template #title>
                    <font-awesome-icon icon="cogs" /> Configuration
                </template>

                <b-form-group
                    :key="p.name"
                    v-for="p in instance.miner.viewParameters"
                    :label="p.name + ': (' + p.type + ')'">
                    <b-form-input v-model="viewParameters[p.name]" required :placeholder="p.name"></b-form-input>
                </b-form-group>

                <b-button
                    @click="updateViews">
                    Update view
                </b-button>
            </b-tab>
            <b-tab
                v-bind:key="v.name"
                v-for="v in views"
                :title="v.name">
                {{ v.value }}
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'InstanceViewer',
    props: ['instances','instancesStatus'],
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
            views: []
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
            if ('id' in this.$route.params) {
                if (this.$route.params.id in this.instances) {
                    this.instance = this.instances[this.$route.params.id];
                    this.host = this.$route.params.host;
                } else {
                    this.$router.push("/");
                }
            }
        },
        updateViews() {
            var config = [];
            for(const p in this.viewParameters) {
                config.push({name: p, value: this.viewParameters[p]});
            }
            axios.post(this.$minerServices.getInstanceView(this.host, this.instance.id), config)
                .then(res => {
                    this.views = res.data;
                    this.$toastr.s("Views updated successfully");
                })
                .catch(err => {
                    console.error(err);
                    this.$toastr.e("Error in updating views");
                });
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
</style>