define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  let TRH = require('app/core/const/index')
  return () => {
    return {
      episode_id: null,
      field_id: null,
      party_no: null,
      layer_num: null,
      square_id: null,
      target_id: null,
	  koban_event_sally: false,
	  check: false,
	  get limit(){
		//Returns level limit of map
		if(this.episode_id>0) {
			return TRH.MapLimit[this.episode_id][this.field_id]
		}
	  },
      get category(){
		//Returns type of Node
        if(this.episode_id>0)
          return _.get(TRHMasterData.getMasterData('FieldSquare'),[this.episode_id, this.field_id, this.layer_num, this.square_id, 'category'],0)
        else
          return _.get(TRHMasterData.getMasterData('EventSquare'),[this.episode_id, this.field_id, this.layer_num, this.square_id, 'category'],0)
      }
    }
  }
})
