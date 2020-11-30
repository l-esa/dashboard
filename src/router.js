import Vue from 'vue'
import VueRouter from 'vue-router'
import InstanceViewer from './components/InstanceViewer';

Vue.use(VueRouter)

const routes = [
  {
    path: '/instances/:host/:instanceId',
    name: 'InstanceViewer',
    component: InstanceViewer,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
