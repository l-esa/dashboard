<template>
    <div>
        <p>File: 
            <code v-html="value" />
        </p>
        <b-button
            :href="value"
            target="_blank">
            Download
        </b-button>
    </div>
</template>

<script>
export default {
    name: 'BinaryTab',
    props: ['value']
}
</script>