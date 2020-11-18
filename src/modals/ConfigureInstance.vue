<template>
    <b-modal
        id="configure-instance"
        :title="'Configure Miner: ' + miner.name"
        @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
            
            <ValidatedInputText
                :key="p.name"
                v-for="p in miner.configurationParameters"
                :label="p.name + ':'"
                :placeholder='p.type'
                :error="'A ' + p.type.toLowerCase() + ' value is required'"
                v-model="parameters[p.name]"
                :state="validateState(p)" />
        </form>
    </b-modal>
</template>

<script>
import _ from 'lodash';
import ValidatedInputText from '../components/ValidatedInputText'
import { required, decimal } from 'vuelidate/lib/validators'

export default {
    name: 'ConfigureInstance',
    props: ['miner'],
    components: {
        ValidatedInputText
    },
    data() {
        return {
            parameters: {}
        }
    },
    validations() {
        const validator = {
            parameters: {}
        };
        _.each(this.miner.configurationParameters, (item) => {
            if (item.type == 'DOUBLE') {
                validator.parameters[item.name] = { required, decimal };
            } else {
                validator.parameters[item.name] = { required };
            }
        });
        return validator;
    },
    methods: {
        validateState(p) {
            if (p.name in this.parameters) {
                const { $dirty, $error } = this.$v.parameters[p.name];
                return $dirty ? !$error : null;
            }
        },
        handleSubmit() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            
            var params = [];
            var arr = Object.keys(this.parameters);
            for (var index = 0; index < arr.length; ++index) {
                var name = arr[index];
                params.push({
                    name: name,
                    value: this.parameters[name]
                });
            }
            this.$emit('configure-instance', params);

            this.$nextTick(() => {this.$bvModal.hide('configure-instance')});
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.handleSubmit();
        }
    }
}
</script>