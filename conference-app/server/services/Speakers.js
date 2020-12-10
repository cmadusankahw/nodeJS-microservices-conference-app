const axios = require('axios');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

class SpeakersService {
  constructor(serviceRegistryUrl, serviceVersionIdentifier) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getNames() {
   const { ip, port } = await this.getService('speakers-service');
   return this.callService ( {
     method: 'get',
     url: `https://${ip}:${port}/names`,
   });
  }

  async getListShort() {
    const { ip, port } = await this.getService('speakers-service');
   return this.callService ( {
     method: 'get',
     url: `https://${ip}:${port}/list-short`,
   });
  }

  async getList() {
    const { ip, port } = await this.getService('speakers-service');
   return this.callService ( {
     method: 'get',
     url: `https://${ip}:${port}/list`,
   });
  }

  async getAllArtwork() {
    const { ip, port } = await this.getService('speakers-service');
   return this.callService ( {
     method: 'get',
     url: `https://${ip}:${port}/artwork`,
   });
  }

  async getSpeaker(shortname) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService ( {
      method: 'get',
      url: `https://${ip}:${port}/speaker/${shortname}`,
    });
  }

  async getArtworkForSpeaker(shortname) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService ( {
      method: 'get',
      url: `https://${ip}:${port}/artwork/${shortname}`,
    });
  }

  async callService(reqestOptions) {

    const servicePath = url.parse(reqestOptions.url).path;

    const cacheKey = crypto.createHash('md5').update(reqestOptions.method + servicePath).digest('hex');

    const result = await circuitBreaker.callService(reqestOptions);

    if(!result) {
      if(!his.cache[cacheKey])  return this.cache[cacheKey];
      return false;
    }

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }

}

module.exports = SpeakersService;
