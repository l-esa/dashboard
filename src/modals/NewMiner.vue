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
            this.$emit('connecting-miner', {host: this.minerHost});
            axios.get(this.$minerServices.getMiners(this.minerHost))
                .then(res => {
                    this.$emit('add-miner', {host: this.minerHost, miners: res.data})
                })
                .catch(err => {
                    this.$emit('offline-miner', {host: this.minerHost});
                    this.$toastr.e(err);
                });
        }
    }
}
</script>