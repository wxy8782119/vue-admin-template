import mockRequest from '@/utils/mockRequest'

export default {
  state: {
    list: {}
  },
  mutations: {
    GETDATA(state, list) {
      state.list = list
    }
  },
  actions: {
    async getData({ commit }) {
      const result = await mockRequest.get('/home/list')
      console.log(result)
      if (result.code === 20000) {
        commit('GETDATA', result.data)
      }
    }
  },
  getters: {}
}
