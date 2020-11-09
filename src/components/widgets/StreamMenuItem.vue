<template>
    <b-list-group-item class="bg-light">
        <font-awesome-icon icon="film" /> {{ processName }}<br>
        <small><font-awesome-icon icon="server" /> <code>{{ brokerHost }}</code> / <code>{{ topicBase }}</code></small>
    </b-list-group-item>
</template>

<script>
export default {
    name: 'StreamMenuItem',
    props: ['processName', 'brokerHost', 'topicBase']
}
</script>