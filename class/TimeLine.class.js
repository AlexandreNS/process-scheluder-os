class TimeLine{
    constructor(){
        this.timeLineItems = []
        this.metrics = []
    }

    addTimeLine(timeLineItem){
        let idPrev = this.timeLineItems.length-1
        if( idPrev >= 0 && 
            this.timeLineItems[idPrev].name == timeLineItem.name ){
                this.timeLineItems[idPrev].length += timeLineItem.length;
                this.timeLineItems[idPrev].interval[1] = timeLineItem.interval[1];
        }else this.timeLineItems[idPrev+1] = timeLineItem
    }

    getMetrics(){
        let { usageCpu, productivity, waitingTimeMean, averageTurnaroundTime } = this.metrics
        return {
            'CPU Utilization': usageCpu,
            'Productivity': productivity,
            'Average Waiting Time': waitingTimeMean,
            'Average Turnaround Time': averageTurnaroundTime
        }
    }

    setMetrics(listProcess = []){
        let totalTime = this.timeLineItems.reduce((acc, cur) => acc + cur.length, 0)
        let nothingExecTime = this.timeLineItems
            .filter(v => v.name == 'nothing')
            .reduce((acc, cur) => acc + cur.length, 0)

        let usageCpu = ((totalTime-nothingExecTime)/totalTime) * 100
        let productivity = listProcess.length/totalTime

        let waitingTime = []
        let turnaroundTime = []
        for(let process of listProcess){
            let timeLineItemsTemp = [ ...this.timeLineItems ]
            let idxSlice = timeLineItemsTemp.reverse().findIndex((value) => value.name == process.name)
            idxSlice = this.timeLineItems.length - 1 - idxSlice

            let waitingProcessTime = this.timeLineItems
                .slice(0, idxSlice)
                .filter( val => val.name != process.name)
                .reduce((acc, cur) => acc+cur.length, 0)

            waitingTime.push(waitingProcessTime - process.arrivalTime)
            turnaroundTime.push(this.timeLineItems[idxSlice].interval[1] - process.arrivalTime)
        }
        let waitingTimeMean = waitingTime.reduce((acc, cur) => acc+cur) / waitingTime.length
        let averageTurnaroundTime = turnaroundTime.reduce((acc, cur) => acc+cur) / turnaroundTime.length
        this.metrics = { usageCpu, productivity, waitingTimeMean, averageTurnaroundTime }
    }
}

module.exports = TimeLine