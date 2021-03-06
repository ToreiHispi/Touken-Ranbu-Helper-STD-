define((require, exports, module) => {
  const defaultPartyModel = require('../model/party')
  return {
    namespaced: true,
    state () {
      return {
        parties: {},
        inBattlePartyNo: null,
		UIDs: {}
      }
    },
    mutations: {
      updateParty (state, payload) {
        let { partyNo, updateData } = payload
        if (!state.parties[partyNo]) {
          Vue.set(state.parties, partyNo, defaultPartyModel())
        }
        mergeModel(state.parties[partyNo], updateData)
      },
      updateLevel (state, payload) {
        let { partyNo, totalLevel, averageLevel } = payload
        if (!state.parties[partyNo]) {
          Vue.set(state.parties, partyNo, defaultPartyModel())
        }
        mergeModel(state.parties[partyNo], {
          totalLevel, averageLevel
        })
      },
      deleteParty (state, payload) {
      let {partyNo} = payload
      Vue.delete(state.parties, partyNo)
	  }
    }
  }
})
