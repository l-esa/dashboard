<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
      <b-navbar-brand href="#">OPM Dashboard</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-b-toggle.sidebar-streams>Streams</b-nav-item>
          <b-nav-item v-b-toggle.sidebar-miners>Miners</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item>About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    

    <SidebarMiners
      :miners="miners"
      :minersStatus="minersStatus"
      @connecting-miner="connectingMiner"
      @add-miner="addMiner"
      @offline-miner="offlineMiner" />
    <SidebarStreams
      :streams="streams"
      @add-stream="addStream" />

    <b-container fluid>
      <b-row>
        <b-col cols="2" class="bg-light border-right full-height px-0">
          <SidebarInstances
            :instances="instances" />
        </b-col>
        <b-col class="p-3">
          <h3>Miner</h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SidebarStreams from './components/widgets/SidebarStreams';
import SidebarMiners from './components/widgets/SidebarMiners';
import SidebarInstances from './components/widgets/SidebarInstances';
import axios from 'axios';

export default {
  name: "App",
  components: {
    SidebarStreams,
    SidebarMiners,
    SidebarInstances
  },
  data() {
    return {
      streams: [],
      miners: {},
      minersStatus: {},
      instances: {},

      polling: null
    }
  },
  methods: {
    connectingMiner(event) {
      this.$set(this.minersStatus, event.host, 'connecting');
      this.$set(this.miners, event.host, {});
    },
    addMiner(event) {
      this.$set(this.minersStatus, event.host, 'online');
      this.$set(this.miners, event.host, event.miners);
      this.refreshData();
      this.$toastr.s("New miner added");
    },
    offlineMiner(event) {
      this.$set(this.minersStatus, event.host, 'offline');
    },

    addStream(event) {
      this.streams.push(event);
      this.$toastr.s("New stream added");
    },

    refreshData() {
      for(const host in this.miners) {
        axios.get(this.$minerServices.getInstances(host))
          .then(res => {
            for (const idx in res.data) {
              var instance = res.data[idx];
              if (!(instance.id in this.instances)) {
                this.$set(this.instances, instance.id, instance);
              }
            }
          })
          .catch(err => console.error(err));
      }
    },

    pollData() {
      this.polling = setInterval(this.refreshData, 1000 * 30);
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  created () {
    this.pollData()
  }
};
</script>

<style>
.full-height {
  height: calc(100vh - 56px);
  overflow-y: auto;
}
</style>
