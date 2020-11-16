<template>
    <div>
        <b-form-group
            v-bind:label="label"
            v-bind:state="state">
            <b-form-input
                type="text"
                :placeholder="placeholder"
                :value="value"
                @input="update"
                v-bind:state="state"
                 />
        </b-form-group>
        <b-form-invalid-feedback v-bind:state="state" v-html="error" />
    </div>
</template>

<script>
export default {
    name: 'ValidatedInputText',
    props: ['label','placeholder','error','value','state'],
    methods: {
        update(newValue) {
            this.$emit('input', newValue); 
        }
    }
}
</script>