<template>
    <div>
        <b-sidebar id="sidebar-miners" title="Miners" shadow backdrop>
            <template #footer="{  }">
                <div class="p-3">
                <b-button block v-b-modal.new-miner>
                    <font-awesome-icon icon="plus" />
                    New miner host
                </b-button>
                </div>
            </template>
            <b-list-group class="py-2" flush>
                <b-list-group-item class="bg-light"
                    v-bind:key="host"
                    v-for="host in Object.keys(miners)">
                    <span
                        v-bind:key="miner.id"
                        v-for="miner in miners[host]">
                        <font-awesome-icon icon="cogs" /> {{ miner.name }}<br>
                    </span>
                    <small><font-awesome-icon icon="circle" style="color: green" /> System online</small><br>
                    <small><font-awesome-icon icon="server" /> <code>{{ host }}</code></small>
                </b-list-group-item>
            </b-list-group>
        </b-sidebar>

        <NewMiner @add-miner="$emit('add-miner', $event)" />
    </div>
</template>

<script>
import NewMiner from '../../modals/NewMiner';

export default {
    name: 'SidebarMiners',
    props: ['miners'],
    components: {
        NewMiner
    }
}
</script>