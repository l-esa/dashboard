<template>
    <b-modal
        id="new-stream"
        @ok="createStream"
        title="New Stream">
        <b-form-group label="Process name:" label-for="processName">
            <b-form-input v-model="processName" required placeholder="Process name"></b-form-input>
        </b-form-group>
        <b-form-group label="MQTT-XES broker:" label-for="brokerHost">
            <b-form-input v-model="brokerHost" required placeholder="MQTT-XES broker"></b-form-input>
        </b-form-group>
        <b-form-group label="MQTT topic:" label-for="topicBase">
            <b-form-input v-model="topicBase" required placeholder="MQTT topic"></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>
export default {
    props: ['streams'],
    data() {
        return {
            processName: '',
            brokerHost: '',
            topicBase: ''
        }
    },
    methods: {
        createStream() {
            this.$emit('add-stream', {processName: this.processName, brokerHost: this.brokerHost, topicBase: this.topicBase})
        }
    }
}
</script>