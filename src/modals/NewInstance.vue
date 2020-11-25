<template>
    <b-modal
        id="new-instance"
        @ok="handleOk"
        title="New Miner Instance">
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <ValidatedInputText
                label="Instance name:"
                placeholder="Instance name"
                error="Enter the instance name name (at lest 2 character)"
                v-model="name"
                type="text"
                :state="validateState('name')" />

            <b-form-group class="mt-3">
                <b-dropdown :text="'Select stream - ' + stream.processName" block variant="outline-secondary">
                    <b-dropdown-item
                        class="py-2"
                        v-bind:key="s.name"
                        v-for="s in streams"
                        @click="stream=s">
                        <font-awesome-icon icon="film" /> {{ s.processName }}<br>
                        <small><font-awesome-icon icon="server" /> <code>{{ s.brokerHost }}</code> / <code>{{ s.topicBase }}</code></small>
                    </b-dropdown-item>
                </b-dropdown>
                <b-form-invalid-feedback :state="stream.processName !== ''">
                    A stream has to be selected
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group>
                <b-dropdown :text="'Select Miner - ' + miner.name" block variant="outline-secondary">
                    <b-dropdown-group
                        v-bind:key="h"
                        v-for="h in Object.keys(miners)">
                        <b-dropdown-item
                            class="py-2"
                            v-bind:key="m.id"
                            v-for="m in miners[h]"
                            @click="miner=m; host=h">
                            <font-awesome-icon icon="cogs" /> {{ m.name }}<br>
                            <small><font-awesome-icon icon="server" /> <code>{{ h }}</code></small>
                        </b-dropdown-item>
                    </b-dropdown-group>
                </b-dropdown>
                <b-form-invalid-feedback :state="miner.name !== ''">
                    A miner has to be selected
                </b-form-invalid-feedback>
            </b-form-group>
        </form>
    </b-modal>
</template>


<script>
import ValidatedInputText from '../components/ValidatedInputText'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'NewInstance',
    props: ['streams','miners'],
    components: {
        ValidatedInputText
    },
    data() {
        return {
            name: '',
            stream: {
                processName: ''
            },
            miner: {
                name: ''
            },
            host: ''
        }
    },
    validations: {
        name: {
            required,
            minLength: minLength(2)
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
            if (this.stream.processName === '') {
                return;
            }
            if (this.miner.name === '') {
                return
            }
            this.$emit('new-instance', {name: this.name, stream: this.stream, miner: this.miner, host: this.host});
            this.$nextTick(() => {this.$bvModal.hide('new-instance')});
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.handleSubmit();
        }
    }
}
</script>