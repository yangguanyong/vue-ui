import Step from './step'
import StepItem from './step-item'

const comp = [Step, StepItem]

comp.forEach(com => {
  com.install = function (Vue) {
    Vue.component(com.name, com)
  }
})

export const _Step = Step
export const _StepItem = StepItem