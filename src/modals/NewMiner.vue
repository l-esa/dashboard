<template>
    <b-modal
        id="new-miner"
        @ok="registerMiner"
        title="New Miner">
        <b-form-group label="Miner host:" label-for="minerHost">
            <b-form-input type="url" v-model="minerHost" required placeholder="Miner host"></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>
export default {
    props: ['miners'],
    data() {
        return {
            minerHost: ''
        }
    },
    methods: {
        registerMiner() {
            this.$emit('add-miner', {host: this.minerHost});
        }
    }
}
</script>