define((require, exports, module) => {
  return (store) => {
    store.subscribe((mutation, state) => {
      
        if (mutation.type === 'duty/updateDuty') {
          let { finished_at, horse_id2, horse_id1, field_id1, field_id2, bout_id1, bout_id2, param } = mutation.payload.updateData
          
          if(param){
          let paramResult = {
            horse_id1: '',
            horse_id2: '',
            field_id1: '',
            field_id2: '',
            bout_id1: '',
            bout_id2: ''
          }
          _.each(paramResult, (v, k)=>{
            if(mutation.payload.updateData[k]){
              up_type = param[mutation.payload.updateData[k]].up_type
              is_max = param[mutation.payload.updateData[k]].is_max
              up_value = param[mutation.payload.updateData[k]].up_value
              valueResult = is_max ? ' MAX' : ' +'+ up_value
              typeResult = ['Mobility', 'Leadership', 'Scouting', 'Survival', 'Impact', 'Impulse'][up_type-1]
              paramResult[k]='('+typeResult+valueResult+')'
            }
          })
          if(finished_at){
            store.commit('log/addDutyLog', {
              logId: `${moment(parseValues(finished_at)).unix()}`,
              finished_at: finished_at,
              horse_id2: horse_id2,
              horse_id1: horse_id1,
              field_id1: field_id1,
              field_id2: field_id2,
              bout_id1: bout_id1,
              bout_id2: bout_id2,
              param: paramResult
            })
          }
        }
        else{
          if(finished_at){
            store.commit('log/addDutyLog', {
              logId: `${moment(parseValues(finished_at)).unix()}`,
              finished_at: finished_at,
              horse_id2: horse_id2,
              horse_id1: horse_id1,
              field_id1: field_id1,
              field_id2: field_id2,
              bout_id1: bout_id1,
              bout_id2: bout_id2
            })
          }
        }
        if (state.config.duty_notice == true) {
          if(state.duty.isIntervalSet == false || state.duty.isIntervalSet == null) {
            console.log("set interval")
            let check = setInterval(function isDutyFinished(){
              state.duty.isIntervalSet = true
              if(finished_at != null && moment(parseValues(finished_at)).isBefore(Date.now())) {
                store.dispatch('notice/addNotice', {
                  title: 'Internal Affairs Ended',
                  message: `End Time： ${moment(parseValues(finished_at)).format('HH:mm:ss')}`,
                  context: 'Please re-assign duties as soon as possible!',
                  renotify: true,
                  disableAutoClose: true,
                  swordBaseId: state.config.secretary,
                  icon: `static/sword/${state.config.secretary}.png`
                })
                clearInterval(check)
                state.duty.isIntervalSet = false
              }
            }, 1000)
          }
          if(_.every([horse_id1, horse_id2, field_id1, field_id2, bout_id1, bout_id2], _.isNull) || JSON.stringify(mutation.payload.updateData)=="{}" || JSON.stringify(mutation.payload.updateData)=="[]") {
            store.dispatch('notice/addNotice', {
              title: 'Internal Affairs Assignment',
              context: 'Your swords aren\'t doing any chores!',
              disableAutoClose: true,
              swordBaseId: state.config.secretary,
              icon: `static/sword/${state.config.secretary}.png`
            })
          }
          else if (!finished_at) {
            finished_at = state.duty.finished_at
          }
        }
      }
    })
  }
})