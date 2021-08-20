import { createRouter, createWebHashHistory } from 'vue-router'
import seat from '../views/Seat.vue'
import rule from '../views/Rule'
import area from '../views/Area'
import plans from '../views/Plans'
import ruleTree from '../views/RuleTree'
import condition from '../views/Condition'

const routes = [
  {
    path: '/',
    name: 'area',
    component: area
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
    path: '/ruleTree',
    name: 'ruleTree',
    component: ruleTree
  },
  {
    path: '/condition',
    name: 'condition',
    component: condition
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
