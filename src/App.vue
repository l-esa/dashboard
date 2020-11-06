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

    <b-sidebar id="sidebar-miners" title="Miners" shadow backdrop>
      <template #footer="{  }">
        <div class="p-3">
          <b-button block>
            <font-awesome-icon icon="plus" />
            New miner
          </b-button>
        </div>
      </template>
      <b-list-group class="py-2" flush>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="cogs" /> Miner 1a<br>
            <font-awesome-icon icon="cogs" /> Miner 1b<br>
            <font-awesome-icon icon="cogs" /> Miner 1c<br>
            <small><font-awesome-icon icon="circle" style="color: green" /> System online</small><br>
            <small><font-awesome-icon icon="server" /> <code>test-miner-1.herokyapp.com</code></small>
        </b-list-group-item>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="cogs" /> Miner 2<br>
            <small><font-awesome-icon icon="circle" style="color: green" /> System online</small><br>
            <small><font-awesome-icon icon="server" /> <code>test-miner-2.herokyapp.com</code></small>
        </b-list-group-item>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="cogs" /> Miner 3<br>
            <small><font-awesome-icon icon="circle" style="color: red" /> System offline</small><br>
            <small><font-awesome-icon icon="server" /> <code>test-miner-3.herokyapp.com</code></small>
        </b-list-group-item>
      </b-list-group>
    </b-sidebar>

    <b-sidebar id="sidebar-streams" title="Streams" shadow backdrop>
      <template #footer="{  }">
        <div class="p-3">
          <b-button block>
            <font-awesome-icon icon="plus" />
            New stream
          </b-button>
        </div>
      </template>
      <b-list-group class="py-2" flush>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="film" /> Process name 1<br>
            <small><font-awesome-icon icon="server" /> <code>mqtt-xes.broker.com</code> / <code>pmcep</code></small>
        </b-list-group-item>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="film" /> Process name 2<br>
            <small><font-awesome-icon icon="server" /> <code>mqtt-xes.broker.com</code> / <code>pmcep</code></small>
        </b-list-group-item>
        <b-list-group-item class="bg-light">
            <font-awesome-icon icon="film" /> BPI Challenge process 1<br>
            <small><font-awesome-icon icon="server" /> <code>mqtt-xes.broker.com</code> / <code>pmcep</code></small>
        </b-list-group-item>
      </b-list-group>
    </b-sidebar>

    <b-container fluid>
      <b-row>
        <b-col cols="2" class="bg-light border-right full-height px-0">
          <header class="mx-3 mt-3"><h5>Instances</h5></header>
          <b-list-group class="py-2" flush>
            <b-list-group-item class="bg-light" href="#">
                <font-awesome-icon icon="angle-down" v-b-toggle.details1 class="float-right" />
                <font-awesome-icon icon="sliders-h" /> Instance 1
                <b-collapse id="details1">
                  <small><font-awesome-icon icon="film" /> BPI Challenge process 1</small><br>
                  <small><font-awesome-icon icon="cogs" /> Miner 2</small><br>
                  <small><font-awesome-icon icon="chart-bar" /> Events: 5k</small><br>
                  <small><font-awesome-icon icon="circle" style="color: green" /> Status: running</small>
                </b-collapse>
            </b-list-group-item>
            <b-list-group-item class="bg-light" href="#">
                <font-awesome-icon icon="angle-down" v-b-toggle.details2 class="float-right" />
                <font-awesome-icon icon="sliders-h" /> Instance 2
                <b-collapse id="details2">
                  <small><font-awesome-icon icon="film" /> BPI Challenge process 1</small><br>
                  <small><font-awesome-icon icon="cogs" /> Miner 2</small><br>
                  <small><font-awesome-icon icon="chart-bar" /> Events: 0</small><br>
                  <small><font-awesome-icon icon="circle" style="color: red" /> Status: not running</small>
                </b-collapse>
            </b-list-group-item>
            <b-list-group-item class="bg-light" href="#">
                <font-awesome-icon icon="angle-down" v-b-toggle.details3 class="float-right" />
                <font-awesome-icon icon="sliders-h" /> Instance 3
                <b-collapse id="details3">
                  <small><font-awesome-icon icon="film" /> BPI Challenge process 1</small><br>
                  <small><font-awesome-icon icon="cogs" /> Miner 2</small><br>
                  <small><font-awesome-icon icon="chart-bar" /> Events: 0</small><br>
                  <small><font-awesome-icon icon="circle" style="color: red" /> Status: not running</small>
                </b-collapse>
            </b-list-group-item>
          </b-list-group>
          <div class="p-3">
            <b-button block>
              <font-awesome-icon icon="plus" />
              New instance
            </b-button>
          </div>
        </b-col>
        <b-col class="p-3">
          <h3>Miner</h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
.full-height {
  height: calc(100vh - 56px);
  overflow-y: auto;
}
</style>
