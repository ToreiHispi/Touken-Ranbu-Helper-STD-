define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  let TRH = require('app/core/const/index')
  return (store) => {
    store.subscribe((mutation, state) => {

      
        if (mutation.type == 'battle/updateBattle' || mutation.type == 'battle/updatePracticeBattle') {
          let { updateData } = mutation.payload
          let resultParty = _(_.get(updateData, ['result', 'player', 'party', 'slot']))
            .values()
            .keyBy(o => o.serial_id)
            .value()
          let playerParty = _(_.get(updateData, ['player', 'party']))
            .values()
            .keyBy(o => o.serial_id)
            .mapValues((v, k) => {
              return {
                serial_id: v.serial_id,
                hp: _.toNumber(v.hp) - _.toNumber(_.get(resultParty, [k, 'hp'], 0)),
                battleStatus: _.toNumber(_.get(resultParty, [k, 'status'], 0))
              }
            })
            .filter(o => o.hp > 0)
            .mapValues((v, k) => {
              let sword = _.get(state, ['swords', 'serial', v.serial_id], {})
              return _.extend(v, {
				        name: sword.sword_id ? (TRH.SwordENGName[String(sword.sword_id)] ? TRH.SwordENGName[String(sword.sword_id)][String(sword.sword_id)] : sword.name) : '-',
                injury: sword.injury,
                baseId: sword.baseId,
                battleStatusText: ['Normal', 'Minor', 'Moderate', 'Severe', 'Retreated', 'Broken'][v.battleStatus]
              })
            })
            .values()
            .value()
          let getSwordId = _.get(updateData, ['result', 'get_sword_id'])
          let getInstrumentId = 0
          if(updateData.result.drop_reward.length!=0){
            getInstrumentId = _.get(updateData, ['result', 'drop_reward', '0', 'item_id'])
          }
          else{
            getInstrumentId = 0
          }
          if(getInstrumentId>29 || getInstrumentId<25){
            getInstrumentId = 0
          }
          let playerEquips = _(_.get(updateData, ['player', 'party']))
            .values()
            .keyBy(o => o.serial_id)
            .mapValues((v, k) => {
              let equip1 = null
              let equip2 = null
              let equip3 = null
              if(v.init_soldier1>0 && v.soldier1 == 0){
                equip1 = v.equip_id1
              }
              if(v.init_soldier2>0 && v.soldier2 == 0){
                equip2 = v.equip_id2
              }
              if(v.init_soldier3>0 && v.soldier3 == 0){
                equip3 = v.equip_id3
              }
              return {
                serial_id: v.serial_id,
                equip: {
                  1: equip1,
                  2: equip2,
                  3: equip3
                }
              }
            })
            .filter(o => {
              if(o.equip[1] != null || o.equip[2] != null || o.equip[3] != null)
                return o
            })
            .mapValues((v,k) => {
              let sword = _.get(state, ['swords', 'serial', v.serial_id], {})
              let equipstring = ''
              if(v.equip[1]!=null)
                //equipstring += '['+_.get(TRHMasterData.getMasterData('Equip'), [v.equip[1], 'name'], '-') + '] '
				        equipstring += '['+(v.equip[1] ? TRH.EquipENGName[v.equip[1]] : '-')+'] '
              if(v.equip[2]!=null)
                //equipstring += '['+_.get(TRHMasterData.getMasterData('Equip'), [v.equip[2], 'name'], '-') + '] '
				        equipstring += '['+ (v.equip[2] ? TRH.EquipENGName[v.equip[2]] : '-') +'] '
              if(v.equip[3]!=null)
                //equipstring += '['+_.get(TRHMasterData.getMasterData('Equip'), [v.equip[3], 'name'], '-') + '] '
				        equipstring += '['+(v.equip[3] ? TRH.EquipENGName[v.equip[3]] : '-')+'] '
              return {
                serial_id: v.serial_id,
				        name: sword.sword_id ? (TRH.SwordENGName[sword.sword_id] ? TRH.SwordENGName[sword.sword_id][sword.sword_id] : sword.name) : '-',
                equips: equipstring
              }
            })
            .values()
            .value()
          let swordName = (getSwordId>0 ? (TRH.SwordENGName[getSwordId] ? TRH.SwordENGName[getSwordId]['full'] : _.get(TRHMasterData.getMasterData('Sword'), [getSwordId, 'name'], '无')): 'None')
          if (getInstrumentId!=0){
            if(getSwordId!=0){
              swordName+=" & "+ getInstrumentId ? (TRH.ItemENGName[getInstrumentId] ? TRH.ItemENGName[getInstrumentId] : _.get(TRHMasterData.getMasterData('Consumable'), [getInstrumentId, 'name'], '-')) : '-'
            }else{
              swordName= getInstrumentId ? (TRH.ItemENGName[getInstrumentId] ? TRH.ItemENGName[getInstrumentId] : _.get(TRHMasterData.getMasterData('Consumable'), [getInstrumentId, 'name'], '-')) : '-'
              getSwordId = 'item'+getInstrumentId
            }
          }
		      let getName = (getSwordId>0 ? (TRH.SwordENGName[getSwordId] ? TRH.SwordENGName[getSwordId][getSwordId] : _.get(TRHMasterData.getMasterData('Sword'), [getSwordId, 'name'], '无')): 'None')
          if(mutation.type === 'battle/updateBattle'){
            store.commit('log/addBattleLog', {
              logId: `${state.sally.party_no}#${state.sally.episode_id}-${state.sally.field_id}@${moment(updateData.now).unix()}`,
              party_no: state.sally.party_no,
              get: getName,
              episode_id: state.sally.episode_id,
              field_id: state.sally.field_id,
              layer_num: state.sally.layer_num,
              square_id: state.sally.square_id,
              rank: updateData.result.rank,
              mvp: updateData.result.mvp,
              now: updateData.now
            })
          }
          if(mutation.type === 'battle/updatePracticeBattle'){
            store.commit('log/addPracticeLog', {
              logId: `${state.sally.party_no}#${state.sally.target_id}@${moment(updateData.now).unix()}`,
              party_no: state.sally.party_no,
              enemy_id: state.sally.target_id,
              enemy_name: updateData.enemy.name,
              enemy_level: updateData.enemy.level,
              rank: updateData.result.rank,
              mvp: updateData.result.mvp,
              now: updateData.now
            })
          }
		  
          let timeout = _.get(state, ['config', 'timeout'], 3)*1000
          if (timeout<3000){
            timeout = 3000
          }
          if (state.config.hurt_notice == true) {
            if (playerParty.length) {
              if (swordName){
                if (playerEquips.length) {
                  //Troop Loss
                  store.dispatch('notice/addNotice', {
                    title: `Battle Report`,
                    message: '<b style="font-size:100%;">[Troop Loss]</b><br>'+_.map(playerEquips, o => `${o.name} - ${o.equips}`).join('<br>'),
                    context: ``,
                    timeout: timeout*2,
                    swordBaseId: getSwordId,
                    icon: `static/sword/${getSwordId}.png`,
                  })
                  //Sword Damage
                  store.dispatch('notice/addNotice', {
                    title: `Battle Report`,
                    message: '<b style="font-size:100%;">[Sword Damage]</b><br>'+_.map(playerParty, o => `[${o.battleStatusText}] ${o.name} HP -${o.hp}`).join('<br>'),
                    context: `Drop： ${swordName}`,
                    timeout: timeout*2,
                    swordBaseId: getSwordId,
                    icon: `static/sword/${getSwordId}.png`,
                  })
                } else {
                  store.dispatch('notice/addNotice', {
                    title: `Battle Report`,
                    message: _.map(playerParty, o => `[${o.battleStatusText}] ${o.name} HP -${o.hp}`).join('<br>'),
                    context: `Drop： ${swordName}`,
                    timeout: timeout*2,
                    swordBaseId: getSwordId,
                    icon: `static/sword/${getSwordId}.png`,
                  })
                }
              }
            }
            else if (playerEquips.length) {
              if (swordName)
              store.dispatch('notice/addNotice', {
                title: `Battle Report`,
                message: _.map(playerEquips, o => `[Troops Loss] ${o.name} - ${o.equips}`).join('<br>'),
                context: `Drop： ${swordName}`,
                timeout: timeout*2,
                swordBaseId: getSwordId,
                icon: `static/sword/${getSwordId}.png`,
              })
            }
            else if (getSwordId !== 0) {
              store.dispatch('notice/addNotice', {
                title: `Battle Report`,
                message: 'No Injuries',
                context: `Drop： ${swordName}`,
                timeout: timeout,
                swordBaseId: getSwordId,
                icon: `static/sword/${getSwordId}.png`
              })
            }
          }
        }
    })
  }
})