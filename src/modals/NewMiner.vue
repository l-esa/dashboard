<template>
    <b-modal
        id="new-miner"
        @ok="registerMiner"
        title="New Miner">
        <b-form-group label="Miner host:" label-for="minerHost">
            <b-form-input v-model="minerHost" required placeholder="Miner host"></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>
import axios from 'axios';

export default {
    props: ['miners'],
    data() {
        return {
            minerHost: ''
        }
    },
    methods: {
        registerMiner() {
            axios.get(this.minerHost + "/api/v1/miners")
                .then(res => {
                    this.$emit('add-miner', {host: this.minerHost, miners: res.data})
                })
                .catch(err => {
                    this.$toastr.e(err);
                });
        }
    }
}
</script>