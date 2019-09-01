import { client } from '@/api';
import { UnkownRequestError, instanceOfRequestError } from '@/constants/error';

export interface File {
  fid: string,
  content: string,
}

interface State {
  fetching: boolean,
  uploading: boolean,
  changedSinceLastSave: boolean,
  data: File,
};

const state: State = {
  fetching: true,
  uploading: true,
  changedSinceLastSave: true,
  data: {
    fid: "",
    content: "",
  },
}

const getters = {
  isFetching: (state: State): boolean => {
    return state.fetching
  },
  isUploading: (state: State): boolean => {
    return state.uploading
  },
  isChangedSinceLastSave: (state: State): boolean => {
    return state.changedSinceLastSave
  },
  getContent: (state: State): string => {
    return state.data.content
  }
}

const actions = {
  // fetchContent 初次进入时下载文件. 传入文件名称.
  async fetchContent({ commit }, fid: string): Promise<any> {
    commit("fetchingContent", fid)
    return new Promise<any>((resolved, reject) => {
      let file: File;
      client.fetchFile({ fid: fid }).then(res => {
        file = {
          fid: fid,
          content: res.request.response,
        }
        resolved()
      }).catch(e => {
        if (instanceOfRequestError(e)) {
          return reject(e)
        }
        console.log("请求服务器发生错误: ", e)
        reject(UnkownRequestError)
      }).finally(() => {
        commit("fetchingContentFinish", file)
      })
    })
  },
  // fetchContentLocal 初次进入时下载文件. 传入文件名称.
  async fetchContentLocal({ commit }, fid: string): Promise<any> {
    commit("fetchingContent", fid)
    return new Promise<any>((resolved, reject) => {
      let file: File = {
        fid: fid,
        content: ""
      };
      let articleStr = window.localStorage.getItem(fid);
      if (articleStr) {
        file = JSON.parse(<string>articleStr);
        if (!file || !file.fid || file.fid != fid) {
          file = {
            fid: fid,
            content: ""
          };
        }
      }
      resolved()
      commit("fetchingContentFinish", file)
    })
  },
  // uploadContentLocal 保存文件.
  async uploadContentLocal({ commit, state }, content: string): Promise<any> {
    commit("uploadContent", content)
    return new Promise<any>((resolved, reject) => {
      window.localStorage.setItem(state.data.fid, JSON.stringify(state.data))
      resolved()
      commit("uploadContentFinish")
    })
  },
}

const mutations = {
  fetchingContent(state: State, fid: string) {
    state.fetching = true
    state.data.fid = fid
    console.log("fetchingContent: ", fid)
  },
  fetchingContentFinish(state: State, file: File) {
    state.fetching = false
    state.changedSinceLastSave = false;
    if (!file) {
      file = {
        fid: "",
        content: ""
      }
    }
    state.data = file
    console.log("fetchingContentFinish: ", file)
  },
  uploadContent(state: State, content: string) {
    state.uploading = true
    state.data.content = content
    console.log("uploadContent: ", content)
  },
  uploadContentFinish(state: State) {
    state.uploading = false
    state.changedSinceLastSave = false;
    console.log("uploadContentFinish.")
  }
}
export default ({
  namespaced: true,
  getters,
  state,
  actions,
  mutations,
});
