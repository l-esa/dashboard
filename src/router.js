import Vue from 'vue'
import VueRouter from 'vue-router'
import InstanceViewer from './components/InstanceViewer';

Vue.use(VueRouter)

const routes = [
  {
    path: '/instances/:host/:id',
    name: 'InstanceViewer',
    component: InstanceViewer
  }
]

const router = new VueRouter({
  routes
})

export default router
