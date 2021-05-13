define((require, exports, module) => {
  const store = require('app/data/index')
  const TRHMasterData = require('app/core/master')
  const TRH = require('app/core/const/index')

  exports.battleStatusText = Vue.filter('battle-status-text', function (statusId) {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [3, 'name'], '-'))) {
      return ['Sortie', 'Light', 'Major', 'Severe', 'Broken'][statusId]
    }
    return ['Sortie', 'Minor', 'Moderate', 'Severe', 'Broken'][statusId]
  })

  exports.statusText = Vue.filter('status-text', function (statusId) {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [3, 'name'], '-'))) {
      return ['-', 'Repair', 'Kiwame', 'Survey', 'Sortie'][statusId]
    }
    return ['-', 'Repair', 'Kiwame', 'Expedition', 'Sortie'][statusId]
  })

  exports.statusCname = Vue.filter('status-cname', function (statusId) {
    return ['normal', 'recovery', 'damaged', 'warning', 'danger'][statusId]
  })

  exports.fatigueCname =  Vue.filter('fatigue-cname', function (fatigueFlag) {
    return ['very-tired', 'tired', 'normal', 'perfect'][fatigueFlag]
  })

  exports.fatigueText = Vue.filter('fatigue-text', function (fatigueFlag) {
    return ['Exhausted', 'Tired', 'Normal', 'Sakura Fubuki'][fatigueFlag]
  })
  
  exports.equipNameFormat = Vue.filter('equip-name-format', (name) => {
    if (/^[A-Za-z]+/.test(name)) {
      return name.replace(' - Gold','').replace(' - Silver','').replace(' - Bronze','').replace(/\d+/, '').trim()
    }
    
    if (!name) {
      //For PVP list
      return
    }
    return name.replace('･特上', '').replace('･上', '').replace('･並', '').replace(/\d+/, '')
  })

  exports.fatigueBuff = Vue.filter('fatigue-buff', function (fatigueFlag) {
    return '(' + ['-40%', '-20%', '+0%', '+20%'][fatigueFlag] + ')'
  })
  
  //Replaces Sword type kanji with type icon
  exports.typePattern = Vue.filter('type-pattern', function (typeName, rarity) {
	  return typeName ? '../../static/sword/ico/' + typeName + '-' + rarity + '.png' : '../../static/sword/0.png'
  })

  exports.swordPattern = Vue.filter('sword-pattern', function (swordId) {
    return swordId ? '../../static/sword/' + swordId + '.png' : '../../static/sword/0.png'
  })
  
  //Replaces Evolution Upgrade unicode symbol with kiwame/toku symbols
  exports.evolutionPattern = Vue.filter('evolution-pattern', function (symbolID) {
	  let evoName = ['normal', 'toku', 'kiwame']
	  return symbolID ? '../../static/sword/ico/' + evoName[symbolID] + '-' + symbolID + '.png' : '../../static/sword/ico/' + evoName[symbolID] + '-' + symbolID + '.png'
  })
  
  //Replaces Omamori with icon
  exports.amuletPattern = Vue.filter('amulet-pattern', function (itemName) {
	  return itemName != "-" ? '../../static/sword/ico/' + itemName.replace('・','-') + '.png' : "-"
  })

  exports.EnemySwordPattern = Vue.filter('enemy-sword-pattern', function (swordId) {
    let imageId = _.get(TRHMasterData.getMasterData('Sword'), [swordId, 'imageId'], 0)
    let rarity = _.get(TRHMasterData.getMasterData('Sword'), [swordId, 'rarity'], 0)
    return swordId ? '../../static/enemy/' + imageId + '_' + rarity + '.png' : '../../static/sword/0.png'
  })

  exports.MapPattern = Vue.filter('map-pattern', function (mapId) {
	  console.log(mapId);
    let [episodeId , fieldId , layerNum] = mapId.split('_')
    if(episodeId > 0)
      return '../../static/map/' + episodeId + '_' + fieldId + '_' + layerNum + '.jpg'
    else if (episodeId < 0){
      let type = _.get(TRHMasterData.getMasterData('Event'), [episodeId, 'type'], 0)
      let map = _.get(TRHMasterData.getMasterData('EventLayer'), [episodeId, fieldId, layerNum, 'map'], 0)
	  
      if(type == 4){
		    //Regiment Maps
        map = fieldId
      };
      if (type == 8 || type == 9) {
        //Special Investigation Maps
        if(layerNum == 2){
          return '../../static/map/event' +  '_' + type + '.jpg'
        }
        //console.log(TRHMasterData.getMasterData('Event')[episodeId]['type'])
        
        //Tentative map version control
        
        if (map >= 2) {
          const evsq = TRHMasterData.getMasterData('EventSquare')
          let evsql = evsq[episodeId][map][layerNum]
          let vers = 1
          for (i=48; i < Object.entries(evsq).length+48; i++) {
            if (type == TRHMasterData.getMasterData('Event')[-i]['type']) {
              if (evsq[-i] !== evsq[episodeId]) {
                //Checks to see if maps are diff, if yes then 'updates' version number
                vers++
              }
              else {
                continue
              }
            }
          }
          console.log(vers)
          return '../../static/map/event' +  '_' + type + '_' + map + '_' + vers + '.jpg'
        }
      }
      return '../../static/map/event' +  '_' + type + '_' + map + '.jpg'
    }
  })

  exports.swordObject = Vue.filter('sword-object', function (serialId) {
    return serialId
  })

  exports.partyStatus = Vue.filter('party-status', (status) => {
    return [
      'locked',
      'normal',
      'conquest',
      'inBattle'
    ][status] || ''
  })

  exports.amuletName = Vue.filter('amulet-name', (itemId) => {
    return [
    '-',
    'Omamori',
    'Omamori・K'
    ][itemId] || ''
  })

  exports.getNotFlg = Vue.filter('not-flg', (flg) =>{
    return ['', '○'][flg]
  })

  exports.hhmmss = Vue.filter('hhmmss', (time) => {
    return moment(time).format('HH:mm:ss')
  })

  exports.MMDDhhmmss = Vue.filter('MMDDhhmmss', (time) => {
    return moment(time).format('MM/DD HH:mm:ss')
  })

  exports.equipLevelName = Vue.filter('equip-level-name', function (equip_id) {
    let level = _.get(TRHMasterData.getMasterData('Equip'), [equip_id, 'rarity'], 0)
    return {
      0: 'destroyed',
      1: 'n',
      3: 'r',
      5: 'sr'
    }[level]
  })

  exports.equipLevelCname = Vue.filter('equip-level-cname', function (level) {
    return {
      0: 'destroyed',
      1: 'n',
      3: 'r',
      5: 'sr'
    }[level]
  })

  exports.rankName = Vue.filter('rank-name', (rank) => {
    return [
      '-',
      'Duel',
      'S',
      'A',
      'B',
      'C',
      'Lost'
    ][rank] || ''
  })

  exports.formationName = Vue.filter('formation-name', (formationId) => {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [3, 'name'], '-'))) {
      return {
        0: 'Unknown',
        1: 'Wedge',
        2: 'Inv. Wedge',
        3: 'Square',
        4: 'Line',
        5: 'Echelon',
        6: 'Inv. Echelon'
      }[formationId] || ''
    }
    return {
      0: 'Unknown',
      1: 'Fish Scale',
      2: 'Crane Wings',
      3: 'Square',
      4: 'Horizontal',
      5: 'Echelon',
      6: 'Reversed'
    }[formationId] || ''
  })

  exports.swordName = Vue.filter('sword-name', (swordId) => {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [swordId, 'name'], '-'))) {
      return _.get(TRHMasterData.getMasterData('Sword'), [swordId, 'name'], '-')
    }

    let name = swordId ? _.get(TRHMasterData.getMasterData('Sword'), [swordId, 'name'], '-') : '空'
    return name == '-' ? '空' : name
  })

  exports.swordHp = Vue.filter('sword-hp', (swordId) => {
    return swordId ? _.get(TRHMasterData.getMasterData('Sword'), [swordId, 'hp'], '-') : '0'
  })

  exports.equipName = Vue.filter('equip-name', (equipId) => {
    if (/^[0-9A-Za-z]+/.test( _.get(TRHMasterData.getMasterData('Equip'), [equipId, 'name'], '-'))) {
      console.log( _.get(TRHMasterData.getMasterData('Equip'), [equipId, 'name'], '-'))
      return _.get(TRHMasterData.getMasterData('Equip'), [equipId, 'name'], '-')
    }

    return equipId ? _.get(TRHMasterData.getMasterData('Equip'), [equipId, 'name'], '-') : '空'
  })

  exports.swordSerialName = Vue.filter('sword-serial-name', (serialId) => {
    return _.get(store.state, ['swords', 'serial', serialId, 'name'], '-')
  })

  exports.equipSerialName = Vue.filter('equip-serial-name', (serialId) => {
    return _.get(store.state, ['equip', 'serial', serialId, 'name'], '-')
  })

  exports.PracticeEnemyEquipName = Vue.filter('practice-enemy-equip-serial-name', (serialId) => {
    return _.get(store.state, ['practice_enemy', 'enemy_equip', serialId, 'name'], '-')
  })

  exports.allEquipSerialName = Vue.filter('all-equip-serial-name', (serialIds) => {
    serialArr = _.map(serialIds, function (serialId) {
      let names = _.get(store.state, ['equip', 'serial', serialId, 'name'], '-')
      let typeId = (_.find(TRHMasterData.getMasterData('Equip'), ['name', names]) ? _.find((TRHMasterData.getMasterData('Equip')), ['name', names])['type'] : 0 )
      let equipId = (_.find(TRHMasterData.getMasterData('Equip'), ['name', names]) ? _.find((TRHMasterData.getMasterData('Equip')), ['name', names])['equipId'] : 0 )
      if (names.indexOf('･') > -1) {
        return TRH.EquipENGName[String(equipId)]
      } else if (names.indexOf('-') > -1) {
        //For EN Server
        return names.replace(' - Bronze','·B').replace(' - Silver','·S').replace(' - Gold','·G')
      }
      if (typeId == 0) {
        return '-'
      }
    })
      return serialArr.join(' / ')
  })

  exports.itemNameFormat = Vue.filter('item-name-format', (ConsumableId) => {
    let name = _.get(TRHMasterData.getMasterData('Consumable'), [ConsumableId, 'name'], '-')
	  return name
  })
  
  // Translation filters
  exports.convertTeamName = Vue.filter('convert-team-name', (team) => {
	  return _.get(store.state, ['party', 'parties', team, 'party_name'], '-').replace('第','Team ').replace('部隊','')
  })
  
  exports.convertSwordNo = Vue.filter('convert-sword-no', (swordID) => {
    if (swordID) {
      if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'name'], '-'))) {
        return _.get(TRHMasterData.getMasterData('Sword'), [swordID, 'name'], '-')
      }

      let name = ""
      if (TRH.SwordENGName[swordID]) {
        name = TRH.SwordENGName[swordID][swordID] + (_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'symbol'], 0) === 2 ? '·🥝' : '')
      }
      else {
        name = _.get(TRHMasterData.getMasterData('Sword'), [swordID, 'name'], '-')
      }
      
      return (swordID ? name : '空')
    }
    return swordID ? '-' : '* HIDDEN '
  })
  
  exports.convertSwordSerial = Vue.filter('convert-sword-serial', (swordSerialID) => {
    if (/^[A-Za-z]+/.test(_.get(store.state, ['swords', 'serial', swordSerialID, 'name'], 0))) {
      return _.get(store.state, ['swords', 'serial', swordSerialID, 'name'], 0)
    }

    let swordID = String(_.get(store.state, ['swords', 'serial', swordSerialID, 'sword_id'], 0))
    let name = ""
    if (TRH.SwordENGName[swordID]) {
      name = (swordID>0 ? TRH.SwordENGName[swordID][swordID] + (_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'symbol'], 0) === 2 ? '·🥝' : '') : "")
    }
    else {
      name = (swordID>0 ? _.get(TRHMasterData.getMasterData('Sword'), [swordID, 'name'], '-') : '空')
    }
    return (swordID ? name : '空')
  })
  
  exports.convertSwordName = Vue.filter('convert-sword-name', (SName) => {
    //For EN Server on Johren.net which uses Latin-based character names, so no need to convert
    if (/^[A-Za-z]+/.test(SName)) {
      return SName
    }

    if (SName=="None" || SName=='空') {
      return SName
    }
    let swordID = (_.find(TRHMasterData.getMasterData('Sword'), ['name', SName.replace('·🥝','')]) ? _.find((TRHMasterData.getMasterData('Sword')), ['name', SName.replace('·🥝','')])['swordId'] : 0 )
    //The _.find() method will only return the first occuring name (ie non-kiwame/pre-toku).
    if (SName.indexOf('·🥝')>-1) {
      swordID += 1
    }
    let name = ""
    if (TRH.SwordENGName[String(swordID)]) {
      name = (swordID ? TRH.SwordENGName[String(swordID)][String(swordID)] + (_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'symbol'], 0) === 2 ? '·🥝' : '') : '')
    }
    else {
      name = SName
    }
    return (swordID ? name : '-')
  })
  
  exports.horseOwnerName = Vue.filter('horse-owner-name', (Owner) => {
    //For When the same horseID is equipped to multiple swords
    if (Owner.indexOf(',') > -1) {
      let owner_list = Owner.split(',')
      
      _.each(owner_list, (v,k) => {
        let ownerID = (_.find(TRHMasterData.getMasterData('Sword'), ['name', owner_list[k].replace('·🥝','')]) ? _.find((TRHMasterData.getMasterData('Sword')), ['name', owner_list[k].replace('·🥝','')])['swordId'] : 0 )
        if (owner_list[k].indexOf('·🥝')>-1) {
          ownerID += 1
        }
        if (TRH.SwordENGName[String(ownerID)]) {
          owner_list[k] = (ownerID ? TRH.SwordENGName[String(ownerID)][String(ownerID)] + (_.get(TRHMasterData.getMasterData('Sword'), [ownerID, 'symbol'], 0) === 2 ? '·🥝' : '') : '')
        }
      })
      return owner_list.join(', ')
    }
    let swordID = (_.find(TRHMasterData.getMasterData('Sword'), ['name', Owner.replace('·🥝','')]) ? _.find((TRHMasterData.getMasterData('Sword')), ['name', Owner.replace('·🥝','')])['swordId'] : 0 )
    //The _.find() method will only return the first occuring name (ie non-kiwame/pre-toku).
    if (Owner.indexOf('·🥝')>-1) {
      swordID += 1
    }
    let name = ""
    if (TRH.SwordENGName[String(swordID)]) {
      name = (swordID ? TRH.SwordENGName[String(swordID)][String(swordID)] + (_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'symbol'], 0) === 2 ? '·🥝' : '') : '')
    }
    else {
      name = Owner
    }
    //let name = (swordID ? TRH.SwordENGName[String(swordID)][String(swordID)] + (_.get(TRHMasterData.getMasterData('Sword'), [swordID, 'symbol'], 0) === 2 ? '·🥝' : '') : '')
    return (swordID ? name : '-')
  })
  
  exports.convertEquipName = Vue.filter('convert-equip-name', (EqName) => {
    if (/^[A-Za-z]+/.test(EqName.replace('H.','Heavy').replace('L.','Light'))) {
      return EqName.replace('H.','Heavy').replace('L.','Light')
    } else if (/^\d\d[A-Za-z ]+/.test(EqName)) {
      return EqName
    }
    
    if (!EqName) {
      //For PVP
      return
    }
    if (_.find(TRHMasterData.getMasterData('Equip'), ['description', EqName])) {
      // Troops Equipped
      let typeID = (_.find(TRHMasterData.getMasterData('Equip'), ['description', EqName]) ? _.find((TRHMasterData.getMasterData('Equip')), ['description', EqName])['type'] : 0 )
      return (typeID ? (TRH.EquipENGType[String(typeID)] ? TRH.EquipENGType[String(typeID)] : EqName) : '空')
    }
    else {
      let typeId = (_.find(TRHMasterData.getMasterData('Equip'), ['name', EqName]) ? _.find((TRHMasterData.getMasterData('Equip')), ['name', EqName])['type'] : 0 )
      let equipID = (_.find(TRHMasterData.getMasterData('Equip'), ['name', EqName]) ? _.find((TRHMasterData.getMasterData('Equip')), ['name', EqName])['equipId'] : 0 )
      // Horses Inventory
      if (typeId == 100) {
        return TRH.EquipENGName[String(equipID)] ? TRH.EquipENGName[String(equipID)] : EqName
      }
      //Troops Inventory
      if (EqName.indexOf('･') > -1) {
        return TRH.EquipENGName[String(equipID)] ? TRH.EquipENGName[String(equipID)] : EqName
      }
      // NO equipped horses in Sword List
      if (!typeId) {
        return '-'
      }
    }
  })
  
  exports.convertItemName = Vue.filter('convert-item-name', (itemID) => {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Consumable'), [itemID, 'name'], '-'))) {
      return _.get(TRHMasterData.getMasterData('Consumable'), [itemID, 'name'], '-')
    }

    return TRH.ItemENGName[String(itemID)] ? TRH.ItemENGName[String(itemID)] : _.get(TRHMasterData.getMasterData('Consumable'), [itemID, 'name'], '-')
  })
  
  exports.convertEnemyName = Vue.filter('convert-enemy-name', (EName) => {
    console.log(EName);
    //Suffixes
    let rank = EName.replace('_丙',' C').replace('_乙',' B').replace('_甲',' A').replace('_放免','').replace('(甲)','')
    
    if (rank.indexOf('_下士') > -1 || rank.indexOf('_上士') >  -1) {
      let list = rank.split('_')
      rank = list[1].concat(' ', list[0])
	  }
    //Event Enemies
    let spec = rank.replace('打刀_志士','Shishi Uchigatana').replace('脇差_郷士','Goushi Wakizashi').replace('打刀_留守居組','Rusuigumi Uchigatana').replace('下士','Kashi').replace('上士','Joushi')
    //Special Sword Types Kunai (tantou), Chuu-wakizashi, Honzashi (uchigatana), Jin-dachi, Nagae yari, Tsukushi Naginata
    let prefix = rank.replace('苦無','Kunai').replace('中','Chuu-').replace('本差','Honzashi').replace('野太刀','Nodachi').replace('陣太刀','Jindachi').replace('長柄','Nagae ').replace('筑紫','Tsukushi ')
    let name = prefix.replace('短刀','Tantou').replace('脇差','Wakizashi').replace('打刀','Uchigatana').replace('大太刀','Ootachi').replace('太刀','Tachi').replace('槍','Yari').replace('薙刀','Naginata')
    return name
  })
  
  exports.missionStatus = Vue.filter('mission-status', (statusNo) => {
    let statusList = ['', 'Open', 'Unclaimed', 'Closed']
    return statusList[statusNo]
  })
  
  exports.convertEventName = Vue.filter('convert-event-name', (EvName) => {
    let type = (_.find(TRHMasterData.getMasterData('Event'), ['name', EvName]) ? _.find(TRHMasterData.getMasterData('Event'), ['name', EvName])['type'] : 0)
    if (type==4) {
      if (EvName.length > 3) {
        return EvName.replace('連隊戦','Regiment Battle').replace('','')
      }
    }
    let eventList = ['','Underground Treasure Chest','War Training Expansion','Village of Treasures - Instrument Gathering Stage','Regiment Battle','Edo Castle Infiltration Investigation','Delicious Dango Chasing Rabbit Village','Hidden Demon Extermination in the Capital','Special Investigation: Jurakutei','Special Investigation: Bunkyuu','Special Investigation: Tenpou Edo','Special Investigation: Keichou Kumamoto','Operation: Recapture the Night Flower','Village of Treasures - Flower Gathering Stage','Special Investigation: Keiou Koufu']
    return eventList[type] ? eventList[type] : EvName
  })

  exports.convertENName = Vue.filter('convert-en-name', (JPterm, ENterm) => {
    if (/^[A-Za-z]+/.test(_.get(TRHMasterData.getMasterData('Sword'), [3, 'name'], '-'))) {
      return ENterm
    }
    return JPterm
  })
})