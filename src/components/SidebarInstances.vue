<template>
    <div>
        <header class="mx-3 mt-3"><h5>Instances</h5></header>
          <b-list-group class="py-2" flush>
            <b-list-group-item
                class="bg-light"
                v-bind:key="i.id"
                v-for="i in instances"
                
                v-b-toggle="'details-id-' + i.id">
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  class="float-right ml-1"
                  :to="{ name: 'InstanceViewer', params: { id: i.id, host: minerIdToHost(i.miner.id) }}"
                  v-b-tooltip.hover.bottom="'Open this instance'"
                  v-on:click.stop="">
                  <font-awesome-icon icon="folder-open" />
                </b-button>
                <font-awesome-icon icon="sliders-h" />
                {{ i.configuration.name }}
                <b-collapse :id="'details-id-' + i.id">
                  <small><font-awesome-icon icon="film" /> {{ i.configuration.stream.processName }}</small><br>
                  <small><font-awesome-icon icon="cogs" /> {{ i.miner.name }}</small><br>
                  <small><font-awesome-icon icon="circle"
                    :class="instancesStatus[i.id]? 'running' : 'not-running'" />&nbsp;
                    <span v-if="instancesStatus[i.id]">Running</span>
                    <span v-else>Not running</span>
                  </small><br>
                  <small><font-awesome-icon icon="server" /> <code>{{ minerIdToHost(i.miner.id) }}</code></small>
                  
                </b-collapse>
            </b-list-group-item>
          </b-list-group>
          <div class="p-3">
            <b-button block v-b-modal.new-instance>
              <font-awesome-icon icon="plus" />
              New instance
            </b-button>
          </div>

          <NewInstance
            :streams="streams"
            :miners="miners"
            @new-instance="newInstance" />
          <ConfigureInstance
            :miner="miner"
            @configure-instance="configureInstance" />
    </div>
</template>

<script>
import NewInstance from '../modals/NewInstance';
import ConfigureInstance from '../modals/ConfigureInstance';

export default {
    name: 'SidebarInstances',
    props: ['streams','miners','instances','instancesStatus'],
    components: {
      NewInstance,
      ConfigureInstance
    },
    data() {
      return {
        miner: {
          name: null
        },
        stream: {},
        name: '',
        host: ''
      }
    },
    methods: {
      minerIdToHost(minerId) {
        for(const host in this.miners) {
          for (const miner in this.miners[host]) {
            if (this.miners[host][miner].id == minerId) {
              return host;
            }
          }
        }
        return 'null';
      },
      newInstance(event) {
        this.miner = event.miner;
        this.stream = event.stream;
        this.name = event.name;
        this.host = event.host;
        if (this.miner.configurationParameters.length > 0) {
          this.$bvModal.show('configure-instance');
        } else {
          this.configureInstance([]);
        }
      },
      configureInstance(event) {
        this.$emit('create-instance', {
          miner: this.miner,
          stream: this.stream,
          parameterValues: event,
          name: this.name,
          host: this.host
        });
      }
    }
}
</script>

<style scoped>
.running {
    color: rgb(0, 204, 0);
}

.not-running {
    color: rgb(170, 20, 20);
}
</style>