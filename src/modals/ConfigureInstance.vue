<template>
    <b-modal
        id="configure-instance"
        :title="'Configure Miner: ' + miner.name"
        @ok="configureInstance">
        
        <b-form-group
            :key="p.name"
            v-for="p in miner.configurationParameters"
            :label="p.name + ': (' + p.type + ')'">
            <b-form-input v-model="parameters[p.name]" required :placeholder="p.name"></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>
export default {
    name: 'ConfigureInstance',
    props: ['miner'],
    data() {
        return {
            parameters: {}
        }
    },
    methods: {
        configureInstance() {
            var params = [];
            var arr = Object.keys(this.parameters);
            for (var index = 0; index < arr.length; ++index) {
                var name = arr[index];
                params.push({ [name]: this.parameters[name]});
            }
            this.$emit('configure-instance', params);
        }
    }
}
</script>