<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
      <b-navbar-brand href="#">OPM Dashboard</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-b-toggle.sidebar-streams>Streams</b-nav-item>
          <b-nav-item v-b-toggle.sidebar-miners>Miners</b-nav-item>
          <b-nav-item v-b-toggle.sidebar-instances>Instances</b-nav-item>
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
    
    <SidebarInstances
      :streams="streams"
      :miners="miners"
      :instances="instances"
      :instancesStatus="instancesStatus"
      @create-instance="createInstance" />

    <b-container fluid>
      <b-row>
        <b-col>
          <router-view
            :instances="instances"
            :instancesStatus="instancesStatus"
            @delete-instance="deleteInstance"
            @start-instance="startInstance"
            @stop-instance="stopInstance" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SidebarStreams from './sidebars/SidebarStreams';
import SidebarMiners from './sidebars/SidebarMiners';
import SidebarInstances from './sidebars/SidebarInstances';
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
      instancesStatus: {},

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
            this.$set(this.miners, event.host, _.sortBy(res.data, ['name']));
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
        // this.$toastr.w("Stream already there");
      }
    },

    createInstance(event) {
      axios.post(this.$minerServices.createInstance(event.host, event.miner.id), {
        name: event.name,
        stream: event.stream,
        parameterValues: event.parameterValues
      })
        .then((res) => {
          this.refreshData();
          this.$toastr.s("New instance created");
          // this.$router.push("/");
          console.log(res);
          // this.$router.push({name: "InstanceViewer", params: {host: this.minerIdToHost(res.data.miner.id), id: res.data.id}});
          // console.log("moved");
        })
        .catch(err => console.error(err));
    },

    startInstance(event) {
      axios.get(this.$minerServices.startInstance(event.host, event.instance.id))
        .then(res => {
            if (res.data == true) {
                this.$toastr.s("Instance started");
                this.$set(this.instancesStatus, event.instance.id, 'mining');
            } else {
                this.$toastr.e("Instance not started correctly");
            }
        })
        .catch(err => console.error(err));
    },

    stopInstance(event) {
      axios.get(this.$minerServices.stopInstance(event.host, event.instance.id))
        .then(res => {
            if (res.data == true) {
                this.$toastr.s("Instance stopped");
                this.$set(this.instancesStatus, event.instance.id, 'not_mining');
            } else {
                this.$toastr.e("Instance not stopped correctly");
            }
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
              axios.get(this.$minerServices.getInstanceStatus(host, instance.id),{
                headers: {instanceId: instance.id}
              })
                .then((res) => {
                  this.$set(this.instancesStatus, res.config.headers.instanceId, res.data.toLowerCase());
                  console.log(res.config.headers.instanceId, res.data);
                })
                .catch(err => console.error(err));
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
      this.polling = setInterval(this.refreshData, 1000 * 10);
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
    this.addStream({processName: "test", brokerHost: "broker.hivemq.com", topicBase: "pmcep"})
    this.addMiner({host: "http://localhost:8083"})
    // this.addMiner({host: "https://miner-backend-eu1-testing.herokuapp.com"})
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
