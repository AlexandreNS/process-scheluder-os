class Process{
    constructor(name, arrivalTime, cpuSteps, priority){
        this.name = name
        this.arrivalTime = arrivalTime
        this.cpuSteps = cpuSteps
        this.priority = priority
        this.state = 'new'
    }
    
    processInQueued(timeLine){
        if(timeLine >= this.arrivalTime && this.state != 'exit') 
            this.state = 'ready'
    }

    executeCpuStep(nExec){
        if (this.cpuSteps-nExec >= 0) this.cpuSteps -= nExec
        if (this.cpuSteps == 0) this.state = 'exit'
    }
}

module.exports = Process