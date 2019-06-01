define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  let TRH = require('app/core/const/index')
  return (store) => {
    store.subscribe((mutation, state) => {
      if (state.config.rare_sword_notice == true) {
        if (mutation.type === 'battle/updateBattle' || mutation.type === 'battle/updatePracticeBattle') {
          let { updateData } = mutation.payload
          let getSwordId = _.get(updateData, ['result', 'get_sword_id'])
		  console.log(getSwordId)
		  let non_drops = [75, 142, 146, 148, 150, 154, 156, 158, 160, 162, 164, 166, 168] //These swords be event drops only (ie Nankai or Hizen)
		  let super_rare = [3, 5, 9, 11, 13, 15, 17, 31, 33, 35, 37, 43, 51, 53, 57, 63, 67, 69, 71, 77, 103, 105, 107, 112, 120, 124, 136, 140, 144]
		  let rare_drops = super_rare.concat([7, 9, 25, 55, 59, 65, 73, 79, 91, 97, 116, 118, 122, 128, 130, 132, 134, 138]) //List of rare swords
          if (rare_drops.indexOf(parseInt(getSwordId, 10)) == -1 || non_drops.indexOf(parseInt(getSwordId, 10)) == -1) {
            console.log("not rare!")
            return
          }
          //let swordNameJPN = _.get(TRHMasterData.getMasterData('Sword'), [getSwordId, 'name'], 'None')
		  let swordName = _.get(TRHMasterData.getMasterData('Sword'), [getSwordId, 'name'], 'None') == 'None' ? 0 : TRH.SwordENGName[getSwordId][getSwordId]
          let timeout = _.get(state, ['config', 'timeout'], 3)*1000
          if (timeout<3000){
            timeout = 3000
          }
          if (swordName){
			if (super_rare.indexOf(parseInt(getSwordId, 10)) > -1) {
			  store.dispatch('notice/addNotice', {
				title: `Super Rare Sword Drop！`,
				message: `You got a super rare drop! Amazing!`,
				context: `Drop： ${swordName}！`,
				renotify: false,
				disableAutoClose: false,
				timeout: timeout,
				swordBaseId: getSwordId,
				icon: `static/sword/${getSwordId}.png`,
			  })
			}
			else if (rare_drops.indexOf(parseInt(getSwordId, 10)) > -1) {
			  store.dispatch('notice/addNotice', {
				title: `Rare Sword Drop！`,
				message: `You got a rare drop. How lucky!`,
				context: `Drop： ${swordName}！`,
				renotify: false,
				disableAutoClose: false,
				timeout: timeout,
				swordBaseId: getSwordId,
				icon: `static/sword/${getSwordId}.png`,
			  })
			}
          }
        }
      }
    })
  }
})