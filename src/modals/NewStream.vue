<template>
    <b-modal
        id="new-stream"
        @ok="handleOk"
        title="New Stream">
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <ValidatedInputText
                label="Process name:"
                placeholder="Process name"
                error="Enter process name (at lest 2 character)"
                v-model="processName"
                :state="validateState('processName')" />
            <ValidatedInputText
                label="MQTT-XES broker:"
                placeholder="broker.host.com"
                error="Enter the host of the broker (examples: <code>broker.host.net</code>)"
                v-model="brokerHost"
                :state="validateState('brokerHost')" />
            <ValidatedInputText
                label="MQTT base topic:"
                placeholder="topic/moreSpecific"
                error="Enter the base topic"
                v-model="topicBase"
                :state="validateState('topicBase')" />
        </form>
    </b-modal>
</template>

<script>
import ValidatedInputText from '../components/ValidatedInputText'
import { required, helpers, minLength } from 'vuelidate/lib/validators'
const host = helpers.regex('host', /^https?:\/\/((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9]{0,61}[a-z0-9]|localhost)(:\d{0,5})?$/i);
const topic = helpers.regex('topic', /^([a-z0-9]\/?)*$/i);

export default {
    name: "NewStream",
    props: ['streams'],
    components: {
        ValidatedInputText
    },
    validations: {
        processName: {
            required,
            minLength: minLength(2)
        },
        brokerHost: {
            required,
            host
        },
        topicBase: {
            required,
            topic
        }
    },
    data() {
        return {
            processName: '',
            brokerHost: '',
            topicBase: ''
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v[name];
            return $dirty ? !$error : null;
        },
        handleSubmit() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            this.$emit('add-stream', {processName: this.processName, brokerHost: this.brokerHost, topicBase: this.topicBase})
            this.$nextTick(() => {this.$bvModal.hide('new-stream')});
        },
        handleOk(bvModalEvt) {
            console.log(1);
            bvModalEvt.preventDefault();
            this.handleSubmit();
        }
    }
}
</script>