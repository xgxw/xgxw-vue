import * as Axios from 'axios'
import { UnauthorizedError, NotFoundError, InvalidTokenError } from '@/constants/error';

const baseURL = process.env.VUE_APP_BASE_URL

export class HTTPClient {
    private readonly axios: Axios.AxiosInstance;

    constructor(requsetConfig: Axios.AxiosRequestConfig) {
        this.axios = Axios.default.create({
            timeout: 0,
            withCredentials: true, // 允许跨域 cookie
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            transformResponse: [
                data => {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = {};
                    }
                    return data;
                },
            ],
            ...requsetConfig,
        })
    }

    async fetchFile(r: FetchFileRequset): Promise<FetchFileResponse> {
        return this.request({
            url: 'v1/file/' + r.fid,
            method: "GET",
        })
    }

    async fetchCatalog(r: FetchCatalogRequset): Promise<FetchCatalogResponse> {
        return this.request({
            url: 'v1/catalog/public/' + r.path + '?options=' + r.options,
            method: "GET",
        })
    }

    // -------------------------- 基础方法 -------------------------------
    async request(req: Axios.AxiosRequestConfig): Promise<any> {
        return new Promise<any>((resolved, reject) => {
            this.axios(req).then(resolved).catch(e => {
                if (e.response) {
                    switch (e.response.status) {
                        case 403:
                            reject(UnauthorizedError)
                        case 404:
                            return reject(NotFoundError)
                        default:
                            return reject(e)
                    }
                } else if (e.request) {
                    return reject(NotFoundError)
                } else {
                    return reject(e)
                }
            })
        })
    }
}

export const client = new HTTPClient({ baseURL: baseURL })

// ----------------------- 结构体定义 --------------------------

export interface FetchFileRequset {
    fid: string
}
export interface FetchFileResponse {
    data: {
        fid: string
        name: string
        content: string
    }
}
export interface FetchCatalogRequset {
    path: string,
    options: string
}
export interface FetchCatalogResponse {
    data: {
        catalog: string,
        paths: string[]
    }
}