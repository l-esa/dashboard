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
                :disabled="running"
                @click="startInstance">
                <font-awesome-icon icon="play" />
                Start
            </b-button>
            <b-button
                variant="outline-secondary"
                :disabled="!running"
                @click="stopInstance">
                <font-awesome-icon icon="pause" />
                Stop
            </b-button>
        </b-button-group>
        <h3 class="border-bottom py-2">
            <font-awesome-icon icon="circle"
                class="small"
                :class="running? 'running' : 'not-running'" />
            {{ instance.configuration.name }}
            <small class="text-muted">
                <span v-if="running">(instance running)</span>
                <span v-else>(instance not running)</span>
            </small></h3>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'InstanceViewer',
    props: ['instances'],
    data() {
        return {
            host: null,
            instance: {
                id: '',
                configuration: {
                    name: null
                }
            },
            running: ''
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
        },
        startInstance() {
            axios.get(this.$minerServices.startInstance(this.host, this.instance.id))
                .then(res => {
                    if (res.data == true) {
                        this.$toastr.s("Instance started");
                        this.fetchData();
                    } else {
                        this.$toastr.e("Instance not started correctly");
                    }
                })
                .catch(err => console.error(err));
        },
        stopInstance() {
            axios.get(this.$minerServices.stopInstance(this.host, this.instance.id))
                .then(res => {
                    if (res.data == true) {
                        this.$toastr.s("Instance stopped");
                        this.fetchData();
                    } else {
                        this.$toastr.e("Instance not stopped correctly");
                    }
                })
                .catch(err => console.error(err));
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