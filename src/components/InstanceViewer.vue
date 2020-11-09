<template>
    <div>
        <b-button-group class="float-right">
            <b-button
                variant="outline-secondary">
                <font-awesome-icon icon="play-circle" />
                Simulate <small>(for 5 minutes)</small></b-button>
            <b-button
                    variant="outline-secondary"
                    @click="$emit('delete-instance', instance)">
                    <font-awesome-icon icon="trash" />
            </b-button>
        </b-button-group>
        <h3 class="border-bottom py-2">{{ instance.configuration.name }}</h3>
    </div>
</template>

<script>
export default {
    name: 'InstanceViewer',
    props: ['instances'],
    data() {
        return {
            instance: {
                id: '',
                configuration: {
                    name: null
                }
            }
        }
    },
    created() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            if ('id' in this.$route.params) {
                if (this.$route.params.id in this.instances) {
                    this.instance = this.instances[this.$route.params.id];
                } else {
                    this.$router.push("/");
                }
            }
        }
    }
}
</script>