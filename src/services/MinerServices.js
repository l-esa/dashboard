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
}