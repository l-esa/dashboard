<template>
    <b-modal
        id="new-instance"
        @ok="createInstance"
        title="New Miner Instance">
        <b-form-group label="Instance name:" label-for="name">
            <b-form-input v-model="name" required placeholder="Instance name"></b-form-input>
        </b-form-group>

        <b-form-group>
            <b-dropdown :text="'Select stream (' + stream.processName + ')'" block variant="outline-secondary">
                <b-dropdown-item
                    class="py-2"
                    v-bind:key="s.name"
                    v-for="s in streams"
                    @click="stream=s">
                    <font-awesome-icon icon="film" /> {{ s.processName }}<br>
                    <small><font-awesome-icon icon="server" /> <code>{{ s.brokerHost }}</code> / <code>{{ s.topicBase }}</code></small>
                </b-dropdown-item>
            </b-dropdown>
        </b-form-group>

        <b-form-group>
            <b-dropdown :text="'Select Miner (' + miner.name + ')'" block variant="outline-secondary">
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
        </b-form-group>
    </b-modal>
</template>


<script>
export default {
    name: 'NewInstance',
    props: ['streams','miners'],
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
    methods: {
        createInstance() {
            this.$emit('new-instance', {name: this.name, stream: this.stream, miner: this.miner, host: this.host});
        }
    }
}
</script>