define((require, exports, module) => {
  const defaultMissionModel = require('../model/mission')
  return {
    namespaced: true,
    state () {
      return {
		UIDs: {},
		missions: {
			daily: {},
			monthly: {},
			objective: {},
			Event: {},
			event: [],
			ignore_mission_ids: []
		}
      }
    },
    mutations: {
	  /*UId (state, payload) {
		let { path_uid, UID } = payload
		if (!state.UIDs[UID]) {
			Vue.set(state.UIDs, UID, defaultMissionModel())
		}
	  },*/
      updateMission (state, payload) {
		let {updateData} = payload
		mergeModel(state.missions, updateData)
	  },
	  updateDaily (state, payload) {
        let {dailyId, updateData} = payload
        if (!state.missions.daily[dailyId]) {
          Vue.set(state.missions.daily, dailyId, defaultMissionModel())
        }
        mergeModel(state.missions.daily[dailyId], updateData)
		//console.log(state.missions.daily)
      },
	  updateMonthly (state, payload) {
		let {monthlyId, updateData} = payload
		if (!state.missions.monthly[monthlyId]) {
          Vue.set(state.missions.monthly, monthlyId, defaultMissionModel())
        }
		mergeModel(state.missions.monthly[monthlyId], updateData)
		//console.log(state.missions.monthly)
	  },
	  updateObjective (state, payload) {
		let {objId, updateData} = payload
		if (!state.missions.objective[objId]) {
			Vue.set(state.missions.objective, objId, defaultMissionModel())
		}
		mergeModel(state.missions.objective[objId], updateData)
	  },
	  updateEvent (state, payload) {
		let {eventId, updateData} = payload
		if (!state.missions.Event[eventId]) {
			Vue.set(state.missions.Event, eventId, defaultMissionModel())
		}
		mergeModel(state.missions.Event[eventId], updateData)
		Vue.delete(state.missions.Event, undefined)
	  }
    }
  }
})