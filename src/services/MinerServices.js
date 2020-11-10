export default class MinerServices {
    getMiners(host) {
        return "http://" + host + "/api/v1/miners";
    }

    getInstances(host) {
        return "http://" + host + "/api/v1/instances";
    }

    createInstance(host, minerId) {
        return "http://" + host + "/api/v1/instances/" + minerId;
    }

    getInstanceRunning(host, minerId) {
        return "http://" + host + "/api/v1/instances/" + minerId + "/status";
    }

    startInstance(host, minerId) {
        return "http://" + host + "/api/v1/instances/" + minerId + "/start";
    }

    stopInstance(host, minerId) {
        return "http://" + host + "/api/v1/instances/" + minerId + "/stop";
    }

    deleteInstance(host, instanceId) {
        return "http://" + host + "/api/v1/instances/" + instanceId + "/delete";
    }
}