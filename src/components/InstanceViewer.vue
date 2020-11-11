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
        <h3 class="border-bottom py-2">
            <font-awesome-icon icon="circle"
                class="small"
                :class="instancesStatus[instance.id]? 'running' : 'not-running'" />
            {{ instance.configuration.name }}
            <small class="text-muted">
                <span v-if="instancesStatus[instance.id]">(instance running)</span>
                <span v-else>(instance not running)</span>
            </small></h3>
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
                }
            }
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
                    axios.get(this.$minerServices.getInstanceRunning(this.host, this.instance.id))
                        .then(res => this.running = res.data)
                        .catch(err => console.error(err));
                } else {
                    this.$router.push("/");
                }
            }
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