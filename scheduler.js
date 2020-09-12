const Process = require('./class/Process.class')
const TimeLineItem = require('./class/TimeLineItem.class')
const TimeLine = require('./class/TimeLine.class')
const helpers = require('./helpers')

function generateProcess(amount) {
    let listProcess = new Array(amount)
    for(let i=0; i<amount; i++){
        let name = helpers.generateName(i)
        let arrivalTime = helpers.randomNumber(0, 7)
        let cpuSteps = helpers.randomNumber(1, 10)
        let priority = helpers.randomNumber(1, 9)
        listProcess[i] = new Process(name, arrivalTime, cpuSteps, priority)
    }
    listProcess.sort((p1, p2) => p1.arrivalTime - p2.arrivalTime)
    return listProcess
}

function schedulerFCFS(listProcess = []){
    listProcess = copyListProcess(listProcess)
    let timeLine = new TimeLine()
    let nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    let time = 0
    while(nProcessExit != listProcess.length){
        listProcess.map((process) => process.processInQueued(time))
        let listProcessReady = listProcess.filter(v => v.state == 'ready')
        let timeLineItem
        let oldTime = time
        if(listProcessReady.length != 0){
            let processRun = listProcessReady[0]
            let name = processRun.name
            let cpuSteps = processRun.cpuSteps
            processRun.executeCpuStep(cpuSteps)
            time += cpuSteps

            listProcessReady[0] = processRun
            timeLineItem = new TimeLineItem(name, cpuSteps, [oldTime, time])
        }else{
            time++
            timeLineItem = new TimeLineItem('nothing', 1, [oldTime, time])
        }
        timeLine.addTimeLine(timeLineItem)
        nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    }
    timeLine.setMetrics(listProcess)
    return timeLine
}
function schedulerSJF(listProcess = []){
    listProcess = copyListProcess(listProcess)
    let timeLine = new TimeLine()
    let nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    listProcess = listProcess.sort((p1, p2) => p1.cpuSteps - p2.cpuSteps)
    
    let time = listProcess.reduce((acc, cur) => Math.max(acc, cur.arrivalTime), 0)
    initialItem = new TimeLineItem('nothing', time, [0, time])
    timeLine.addTimeLine(initialItem)
    
    while(nProcessExit != listProcess.length){
        listProcess.map((process) => process.processInQueued(time))
        let listProcessReady = listProcess.filter(v => v.state == 'ready')
        let timeLineItem
        let oldTime = time
        if(listProcessReady.length != 0){
            let processRun = listProcessReady[0]
            let name = processRun.name
            let cpuSteps = processRun.cpuSteps
            processRun.executeCpuStep(cpuSteps)
            time += cpuSteps
            
            listProcessReady[0] = processRun
            timeLineItem = new TimeLineItem(name, cpuSteps, [oldTime, time])
        }else{
            time++
            timeLineItem = new TimeLineItem('nothing', 1, [oldTime, time])
        }
        timeLine.addTimeLine(timeLineItem)
        nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    }
    timeLine.setMetrics(listProcess)
    return timeLine
}
function schedulerRoundRobin(listProcess = [], quantum){
    listProcess = copyListProcess(listProcess)
    let timeLine = new TimeLine()
    let nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    let time = 0
    let frontQueued = 0
    while(nProcessExit != listProcess.length){
        listProcess.map((process) => process.processInQueued(time))
        let listProcessReady = listProcess.filter(v => v.state == 'ready')
        let timeLineItem
        let oldTime = time
        if(listProcessReady.length != 0){
            if(frontQueued >= listProcess.length) frontQueued = 0

            let processRun = listProcess[frontQueued]
            if(processRun.state != 'ready'){
                frontQueued++
                continue
            }
            let name = processRun.name
            let cpuSteps = processRun.cpuSteps
            let cpuStepsExec = cpuSteps < quantum ? cpuSteps : quantum
            processRun.executeCpuStep(cpuStepsExec)
            time += cpuStepsExec
            
            listProcess[frontQueued] = processRun
            timeLineItem = new TimeLineItem(name, cpuStepsExec, [oldTime, time])
            frontQueued++
        }else{
            time++
            timeLineItem = new TimeLineItem('nothing', 1, [oldTime, time])
        }
        timeLine.addTimeLine(timeLineItem)
        nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    }
    timeLine.setMetrics(listProcess)
    return timeLine
}
function schedulerByPriority(listProcess = []){
    listProcess = copyListProcess(listProcess)
    let timeLine = new TimeLine()
    let nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    let time = 0
    while(nProcessExit != listProcess.length){
        listProcess.map((process) => process.processInQueued(time))
        
        let listProcessReady = listProcess
        .filter(v => v.state == 'ready')
        .sort((p1, p2) => -1*(p1.priority - p2.priority))
        
        let timeLineItem
        let oldTime = time
        if(listProcessReady.length != 0){
            let processRun = listProcessReady[0]
            let name = processRun.name
            processRun.executeCpuStep(1)
            time++
            
            listProcessReady[0] = processRun
            timeLineItem = new TimeLineItem(name, 1, [oldTime, time])
        }else{
            time++
            timeLineItem = new TimeLineItem('nothing', 1, [oldTime, time])
        }
        timeLine.addTimeLine(timeLineItem)
        nProcessExit = listProcess.reduce((acc, cur) => cur.state == 'exit' ? acc+1 : acc, 0)
    }
    timeLine.setMetrics(listProcess)
    return timeLine
}
function copyListProcess(listProcess = []){
    return listProcess.map(process => {
        let { name, arrivalTime, cpuSteps, priority } = process
        return new Process(name, arrivalTime, cpuSteps, priority)
    })
}

module.exports = {
    generateProcess,
    FCFS: schedulerFCFS,
    SJF: schedulerSJF,
    roundRobin: schedulerRoundRobin,
    byPriority: schedulerByPriority,
}