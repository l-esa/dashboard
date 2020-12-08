<template>
    <div v-html="value"></div>
</template>

<script>
export default {
    name: 'RawTab',
    props: ['value']
}
</script>