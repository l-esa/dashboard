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
      @add-miner="addMiner" />

    <SidebarStreams
      :streams="streams"
      @add-stream="addStream" />

    <b-container fluid>
      <b-row>
        <b-col cols="2" class="bg-light border-right full-height px-0">
          <SidebarInstances
            :streams="streams"
            :miners="miners"
            :instances="instances"
            @create-instance="createInstance" />
        </b-col>
        <b-col class="p-3">
          <router-view
            :instances="instances"
            @delete-instance="deleteInstance" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SidebarStreams from './components/SidebarStreams';
import SidebarMiners from './components/SidebarMiners';
import SidebarInstances from './components/SidebarInstances';
import axios from 'axios';
import _ from 'lodash';

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
    addMiner(event) {
      this.$set(this.miners, event.host, {});
      this.$set(this.minersStatus, event.host, 'connecting');
      axios.get(this.$minerServices.getMiners(event.host))
        .then(res => {
            this.$set(this.minersStatus, event.host, 'online');
            this.$set(this.miners, event.host, res.data);
            this.refreshData();
            this.$toastr.s("New miner added");
        })
        .catch(err => {
            this.$set(this.minersStatus, event.host, 'offline');
            this.$toastr.e(err);
        });
    },

    addStream(event) {
      if (_.find(this.streams, event) == undefined) {
        this.streams.push(event);
        this.$toastr.s("New stream added");
      } else {
        this.$toastr.w("Stream already there");
      }
    },

    createInstance(event) {
      axios.post(this.$minerServices.createInstance(event.host, event.miner.id), {
        name: event.name,
        stream: event.stream,
        parameterValues: event.parameterValues
      })
        .then(() => {
          this.refreshData();
          this.$toastr.s("New instance created");
        })
        .catch(err => console.error(err));
    },

    deleteInstance(event) {
      axios.delete(this.$minerServices.deleteInstance(this.minerIdToHost(event.miner.id), event.id))
        .then(() => {
          this.refreshData();
          this.$delete(this.instances, event.id);
          this.$toastr.s("Instance deleted");
          this.$router.push("/");
        })
        .catch(err => console.error(err));
    },

    refreshData() {
      for(const host in this.miners) {
        axios.get(this.$minerServices.getInstances(host))
          .then(res => {
            for (const idx in res.data) {
              var instance = res.data[idx];
              if (!(instance.id in this.instances)) {
                this.$set(this.instances, instance.id, instance);
                this.addStream(instance.configuration.stream);
              }
            }
          })
          .catch(err => console.error(err));
      }
    },

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

    pollData() {
      this.polling = setInterval(this.refreshData, 1000 * 30);
    }
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  mounted() {
    this.addStream({processName: "Hospital log", brokerHost: "broker.hivemq.com", topicBase: "pmcep"})
    this.addStream({processName: "BPIC15_3.xes", brokerHost: "broker.hivemq.com", topicBase: "pmcep"})
    this.addStream({processName: "Disco Example Log", brokerHost: "broker.hivemq.com", topicBase: "pmcep"})
    this.addStream({processName: "BPIC15_1.xes", brokerHost: "broker.hivemq.com", topicBase: "pmcep"})
    this.addMiner({host: "localhost:8083"})
    this.addMiner({host: "miner-backend-us1.herokuapp.com"})
  },
  created() {
    this.pollData();
  }
};
</script>

<style>
.full-height {
  height: calc(100vh - 56px);
  overflow-y: auto;
}
</style>
