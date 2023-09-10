import { HttpsProxyAgent } from 'https-proxy-agent';

export default () => {
    if (process.env.https_proxy) {
        return new HttpsProxyAgent(process.env.https_proxy)
    }
    return null
}