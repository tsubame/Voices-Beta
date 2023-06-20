
/**
 * export
 */
export default {
  // namespace
  namespaced: true,
  
  // state
  state: {
    selectedBgmFileName: "",
    showBGMSelectDialog: false,
  },  

  //======================================================
  //
  // 2. Getter
  //
  //======================================================

  getters: {
    /**
     * BGM選択用ダイアログの表示状況を返す
     * 
     * @param {} state 
     * @returns 
     */
    getShowBGMSelectDialog: state => {
      return state.showBGMSelectDialog;
    },

    /**
     * 選択中のBGMのファイル名を返す
     * 
     * @param {} state 
     * @returns 
     */
    getSelectedBgmFileName: state => {
      return state.selectedBgmFileName;
    },
  },

  //======================================================
  //
  // 3. Mutation（Storeの値の変更）
  //
  //======================================================

  mutations: {
    /**
     * 選択中のBGMをセット
     * 
     * @param {} state 
     * @param {*} fName 
     */
    setSelectedBgmFileName(state, fName) {
      state.selectedBgmFileName = fName
    },

    /**
     * BGM選択ダイアログの表示状況をセット
     */
    setShowBGMSelectDialog(state, val) {
      state.showBGMSelectDialog = val
    }
  }

}
