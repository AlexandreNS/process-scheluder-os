const Process = require('./class/Process.class')
const scheduler = require('./scheduler')

const listProcess = scheduler.generateProcess(10)
console.table(listProcess);

const timeLineFCFS = scheduler.FCFS(listProcess)
const timeLineSJF = scheduler.SJF(listProcess)
const timeLineRoundRobin = scheduler.roundRobin(listProcess, 1)
const timeLineByPriority = scheduler.byPriority(listProcess)

console.log("\n-------------FCFS-------------")
console.table(timeLineFCFS.timeLineItems)
console.log("-------------Metrics-------------")
console.table(timeLineFCFS.getMetrics())

console.log("\n-------------SJF-------------")
console.table(timeLineSJF.timeLineItems)
console.log("-------------Metrics-------------")
console.table(timeLineSJF.getMetrics())

console.log("\n-------------RoundRobin-------------")
console.table(timeLineRoundRobin.timeLineItems)
console.log("-------------Metrics-------------")
console.table(timeLineRoundRobin.getMetrics())

console.log("\n-------------ByPriority-------------")
console.table(timeLineByPriority.timeLineItems)
console.log("-------------Metrics-------------")
console.table(timeLineByPriority.getMetrics())
