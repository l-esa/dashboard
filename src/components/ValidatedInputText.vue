<template>
    <div>
        <b-form-group
            v-bind:label="label"
            v-bind:state="state">
            <b-form-file
                v-if="type.toLowerCase() == 'file'"
                placeholder="Upload the file"
                drop-placeholder="Drop file here..."
                @input="updateUpload"
                v-bind:state="state"
                 />
            <b-form-input
                v-else
                type="text"
                :placeholder="placeholder"
                :value="value"
                @input="update"
                v-bind:state="state"
                 />
            <b-form-invalid-feedback
                v-bind:state="state"
                v-html="error" />
        </b-form-group>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ValidatedInputText',
    props: ['host','label','placeholder','error','value','state','type'],
    methods: {
        updateUpload(file) {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            let fd = new FormData();
            fd.append('file',file)
            axios.post(this.$minerServices.uploadFile(this.host), fd, config)
                .then(res => {
                    this.$emit('input', res.data);
                })
                .catch(err => console.error(err));
        },
        update(newValue) {
            this.$emit('input', newValue); 
        }
    }
}
</script>