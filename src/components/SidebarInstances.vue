<template>
    <div>
        <header class="mx-3 mt-3"><h5>Instances</h5></header>
          <b-list-group class="py-2" flush>
            <b-list-group-item
                class="bg-light"
                href="#"
                v-bind:key="i.id"
                v-for="i in instances"
                v-b-toggle="'details-id-' + i.id">
                <font-awesome-icon icon="sliders-h" /> {{ i.id }}
                <b-collapse :id="'details-id-' + i.id">
                  <small><font-awesome-icon icon="film" /> {{ i.configuration.stream.processName }}</small><br>
                  <small><font-awesome-icon icon="cogs" /> {{ i.miner.name }}</small><br>
                  <small><font-awesome-icon icon="chart-bar" /> Events: --</small><br>
                  <small><font-awesome-icon icon="circle" /> Status: --</small>
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
            @new-instance="configureInstance" />
          <ConfigureInstance
            :miner="miner" />
    </div>
</template>

<script>
import NewInstance from '../modals/NewInstance';
import ConfigureInstance from '../modals/ConfigureInstance';

export default {
    name: 'SidebarInstances',
    props: ['streams','miners','instances'],
    components: {
      NewInstance,
      ConfigureInstance
    },
    data() {
      return {
        miner: {
          name: null
        }
      }
    },
    methods: {
      configureInstance(event) {
        this.miner = event.miner;
        this.$bvModal.show('configure-instance');
      }
    }
}
</script>