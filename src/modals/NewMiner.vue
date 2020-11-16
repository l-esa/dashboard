<template>
    <b-modal
        id="new-miner"
        @ok="handleOk"
        title="New Miner">
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Miner host:">
                <b-form-input
                    type="text"
                    v-model="minerHost"
                    :state="validateState('minerHost')"
                    required
                    placeholder="http://miner.host.net"></b-form-input>
            </b-form-group>
            <b-form-invalid-feedback :state="validateState('minerHost')">
                Enter the host of the miner (examples: <code>http://miner.host.net</code> or <code>https://miner.host.net</code>).
            </b-form-invalid-feedback>
        </form>
    </b-modal>
</template>

<script>
import { required, helpers } from 'vuelidate/lib/validators'
const host = helpers.regex('host', /^https?:\/\/((?:[a-z0-9](?:[a-z0-9]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9]{0,61}[a-z0-9]|localhost)(:\d{0,5})?$/i)

export default {
    props: ['miners'],
    data() {
        return {
            minerHost: ''
        }
    },
    validations: {
        minerHost: {
            required,
            host
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
            this.$emit('add-miner', {host: this.minerHost});
            this.$nextTick(() => {this.$bvModal.hide('new-miner')});
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.handleSubmit();
      },
    }
}
</script>