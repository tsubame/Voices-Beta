export default {

  // namespace
  namespaced: true,

  state() {
    return {
      todos: []
    };
  },
  mutations: {
    addTodo: (state, payload) => {
      state.todos.push(payload);
    }
  },
  actions: {
    async addTodoAsync({ commit }, payload) {
      // 非同期処理の後にミューテーションを呼び出す
      commit("addTodo", payload, { root: true });
    }
  }
};