import Vue from 'vue'
import { client } from '@/api';
import { UnkownRequestError, instanceOfRequestError } from '@/constants/error';

export interface Article {
  fid: string,
  name: string,
  content: string,
}

interface State {
  fetching: boolean,
  uploading: boolean,
  changedSinceLastSave: boolean,
  data: Article,
};

const state: State = {
  fetching: true,
  uploading: true,
  changedSinceLastSave: true,
  data: {
    fid: "",
    name: "",
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
      let article: Article;
      client.fetchFile({ fid: fid }).then(res => {
        article = {
          fid: res.data.fid,
          name: res.data.name,
          content: res.data.content,
        }
        resolved()
      }).catch(e => {
        if (instanceOfRequestError(e)) {
          return reject(e)
        }
        console.log("请求服务器发生错误: ", e)
        reject(UnkownRequestError)
      }).finally(() => {
        commit("fetchingContentFinish", article)
      })
    })
  },
  // fetchContentLocal 初次进入时下载文件. 传入文件名称.
  async fetchContentLocal({ commit }, fid: string): Promise<any> {
    commit("fetchingContent", fid)
    return new Promise<any>((resolved, reject) => {
      let article: Article = {
        fid: fid
      };
      let articleStr = window.localStorage.getItem(fid);
      if (articleStr) {
        article = JSON.parse(<string>articleStr);
        if (!article || !article.fid || article.fid != fid) {
          article = {
            fid: fid
          };
        }
      }
      resolved()
      commit("fetchingContentFinish", article)
    })
  },
  // changeContent 更改vuex Content 内容. Editor.vue change事件触发
  async changeContent({ commit, state }, content: string): Promise<any> {
    return new Promise<any>((resolved, reject) => {
      if (state.data && (state.data.content == content)) {
        resolved()
      }
      commit("changeContent", content)
      resolved()
    })
  },
  // uploadContentLocal 初次进入时下载文件. 传入文件名称.
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
  fetchingContentFinish(state: State, article: Article) {
    state.fetching = false
    state.changedSinceLastSave = false;
    if (!article) {
      article = {
        fid: "",
        name: "",
        content: ""
      }
    }
    state.data = article
    console.log("fetchingContentFinish: ", article)
  },
  changeContent(state: State, content: string) {
    state.data.content = content
    state.changedSinceLastSave = true;
    console.log("changeContent: ", content)
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
