export default class MinerServices {

    getMiners(host) {
        return host + "/api/v1/miners";
    }

    getInstances(host) {
        return host + "/api/v1/instances";
    }

    createInstance(host, minerId) {
        return host + "/api/v1/instances/" + minerId;
    }

    getInstanceRunning(host, instanceId) {
        return host + "/api/v1/instances/" + instanceId + "/status";
    }

    getInstanceView(host, instanceId) {
        return host + "/api/v1/instances/" + instanceId + "/view";
    }

    startInstance(host, instanceId) {
        return host + "/api/v1/instances/" + instanceId + "/start";
    }

    stopInstance(host, instanceId) {
        return host + "/api/v1/instances/" + instanceId + "/stop";
    }

    deleteInstance(host, instanceId) {
        return host + "/api/v1/instances/" + instanceId + "/delete";
    }
}