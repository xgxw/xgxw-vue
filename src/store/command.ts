import { client, FetchCatalogRequset } from '@/api';
import { instanceOfRequestError, UnkownRequestError } from '@/constants/error';
import { SelectItem } from '@/constants/command';

interface State {
  fetching: boolean
  data: {
    catalog: string,
    paths: string[],
    pageDataSet: SelectItem[]
  }
};

const state: State = {
  fetching: false,
  data: {
    catalog: "{}",
    paths: [],
    pageDataSet: []
  }
}

const getters = {
  getPageDataSet: (state: State): SelectItem[] => {
    return state.data.pageDataSet
  },
  isFetching: (state: State): boolean => {
    return state.fetching
  },
  getCatalog: (state: State): string => {
    return state.data.catalog
  },
  getCatalogByPath: (state: State) => (path: string) => {
    let data = {}
    if (path) {
      data = JSON.parse(state.data.catalog);
      let keys = path.split("/");
      keys.forEach(key => {
        if (key) {
          if (data[key]) data = data[key];
        }
      });
    }
    return JSON.stringify(data)
  },
  getPaths: (state: State): string[] => {
    return state.data.paths
  }
}

interface FetchCatalogData {
  catalog: string,
  paths: string[]
}

const actions = {
  async changePageDataSet({ commit }, pageDataSet: SelectItem[]): Promise<any> {
    return new Promise<any>((resolved, reject) => {
      commit("changePageDataSet", pageDataSet)
      resolved()
    })
  },
  async fetchCatalog({ commit }, r: FetchCatalogRequset): Promise<any> {
    commit("fetchCatalog")
    return new Promise<any>((resolved, reject) => {
      let data: FetchCatalogData = {
        catalog: "{}",
        paths: []
      }

      client.fetchCatalog(r).then(res => {
        data.catalog = res.data.catalog
        data.paths = res.data.paths
        resolved()
      }).catch(e => {
        if (instanceOfRequestError(e)) {
          return reject(e)
        }
        console.log("请求服务器发生错误: ", e)
        reject(UnkownRequestError)
      }).finally(() => {
        commit("fetchCatalogFinish", data)
      })
    })
  },
}

const mutations = {
  changePageDataSet(state: State, pageDataSet: SelectItem[]) {
    state.data.pageDataSet = pageDataSet;
    console.log("changePageDataSet: ", pageDataSet)
  },
  fetchCatalog(state: State) {
    state.fetching = true
    console.log("fetchCatalog")
  },
  fetchCatalogFinish(state: State, data: FetchCatalogData) {
    state.fetching = false
    state.data.catalog = data.catalog;
    state.data.paths = data.paths
    console.log("getCatalogFinish: ", data.catalog, data.paths)
  }
}
export default ({
  namespaced: true,
  getters,
  state,
  actions,
  mutations,
});
