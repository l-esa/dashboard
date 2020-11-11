export default class MinerServices {
    constructor() {
        this.protocol = "https";
    }

    getMiners(host) {
        return this.protocol + "://" + host + "/api/v1/miners";
    }

    getInstances(host) {
        return this.protocol + "://" + host + "/api/v1/instances";
    }

    createInstance(host, minerId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + minerId;
    }

    getInstanceRunning(host, instanceId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + instanceId + "/status";
    }

    getInstanceView(host, instanceId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + instanceId + "/view";
    }

    startInstance(host, instanceId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + instanceId + "/start";
    }

    stopInstance(host, instanceId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + instanceId + "/stop";
    }

    deleteInstance(host, instanceId) {
        return this.protocol + "://" + host + "/api/v1/instances/" + instanceId + "/delete";
    }
}