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
                    <table>
                        <tr
                            v-bind:key="miner.id"
                            v-for="miner in miners[host]">
                            <td class="align-top"><font-awesome-icon icon="cogs" /></td>
                            <td>{{ miner.name }}</td>
                        </tr>
                        <tr>
                            <td><small><font-awesome-icon icon="circle" :class="minersStatus[host]" /></small></td>
                            <td><small>{{ getMinerStatus(host) }}</small></td>
                        </tr>
                        <tr>
                            <td><small><font-awesome-icon icon="server" /></small></td>
                            <td><small><code>{{ host.replace("http://", "").replace("https://", "") }}</code></small></td>
                        </tr>
                    </table>
                </b-list-group-item>
            </b-list-group>
        </b-sidebar>

        <NewMiner
            @add-miner="$emit('add-miner', $event)" />
    </div>
</template>

<script>
import NewMiner from '../modals/NewMiner';

export default {
    name: 'SidebarMiners',
    props: ['miners', 'minersStatus'],
    components: {
        NewMiner
    },
    methods: {
        getMinerStatus(host) {
            if (this.minersStatus[host] == "online") {
                return "System online";
            } else if (this.minersStatus[host] == "connecting") {
                return "Connecting...";
            } else {
                return "System offline";
            }
        }
    }
}
</script>

<style scoped>
.online {
    color: rgb(0, 204, 0);
}

.offline {
    color: rgb(170, 20, 20);
}

.connecting {
    color: rgb(180, 141, 56);
}
</style>