<template>
    <div>
        <b-sidebar id="sidebar-streams" title="Streams" shadow backdrop>
        <template #footer="{  }">
            <div class="p-3">
            <b-button block v-b-modal.new-stream>
                <font-awesome-icon icon="plus" />
                New stream
            </b-button>
            </div>
        </template>
        <b-list-group class="py-2" flush>
            <StreamMenuItem
                v-bind:key="s.name"
                v-for="s in streams"
                :processName="s.processName"
                :brokerHost="s.brokerHost"
                :topicBase="s.topicBase"
                />

            <!-- <b-list-group-item class="bg-light"
                v-bind:key="s.name"
                v-for="s in streams">
                <font-awesome-icon icon="film" /> {{ s.processName }}<br>
                <small><font-awesome-icon icon="server" /> <code>{{ s.brokerHost }}</code> / <code>{{ s.topicBase }}</code></small>
            </b-list-group-item> -->
        </b-list-group>
        </b-sidebar>

        <NewStream
            @add-stream="$emit('add-stream', $event)"
            :streams="streams" />
    </div>
</template>

<script>
import NewStream from '../modals/NewStream';
import StreamMenuItem from './widgets/StreamMenuItem';

export default {
    name: 'SidebarStream',
    props: ['streams'],
    components: {
        NewStream,
        StreamMenuItem
    }
}
</script>