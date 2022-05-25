import { createRouter, createWebHashHistory } from 'vue-router'
import seat from '../views/Seat.vue'
import rule from '../views/Rule'
import area from '../views/Area'
import plans from '../views/Plans'
import ruleTree from '../views/RuleTreewithand'
import areaConfig from '../views/AreaConfig'
import regionConfig from '../views/RegionConfig'
import planCondition from '../views/PlanCondition'
import craneConfig from '../views/CraneConfig'
import planDetail from '../views/PlanDetail'

const routes = [
  {
    path: '/',
    name: 'ruleTree',
    component: ruleTree
  },
  {
    path: '/seat',
    name: 'seat',
    component: seat
  },
  {
    path: '/rule',
    name: 'rule',
    component: rule
  },
  {
    path: '/plans',
    name: 'plans',
    component: plans
  },
  {
    path: '/area',
    name: 'area',
    component: area
  },
  {
    path: '/areaConfig',
    name: 'areaConfig',
    component: areaConfig
  },
  {
    path: '/regionConfig',
    name: 'regionConfig',
    component: regionConfig
  },
  {
    path: '/planCondition',
    name: 'planCondition',
    component: planCondition
  },
  {
    path: '/craneConfig',
    name: 'craneConfig',
    component: craneConfig
  },
  {
    path: '/planDetail',
    name: 'planDetail',
    component: planDetail
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
