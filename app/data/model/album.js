define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  return () => {
    return {
      sword_id: null,
      image_flg: null,
      letter: null,
      bgm_flg: null,
      new_flg: null,
	  flg_max: null,
      get name () {
        return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'name'], 'N/A') + (_.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'symbol'], 0) === 2 ? '·🌸' : '')
      },
      get all_img_flg () {
		//image_flg==3 Default {Card,Normal,Battle}
		//image_flg==7 Injured (No awakening, IA, keisou)
		//image_flg==11 Awakened (No injured, IA, keisou)
		//image_flg==15 Injured, Awakened (No IA, keisou)
		
		//image_flg==19 IA (No injured, awakening, keisou)
		//image_flg==23 Injured, IA (No awakening, keisou)
		//image_flg==27 Awakened, IA (No injured, keisou)
		//image_flg==31 All (No keisou)
		
		//image_flg==35 Keisou (No injured, awakening, IA)
		//image_flg==39 Injured, Keisou (No awakening, IA)
		//image_flg==43 ???
		//image_flg==47 Injured, Awakened, Keisou (No IA)
		
		//image_flg==51 IA, Keisou (No injured, no awakening)
		//image_flg==55 Injured, IA, Keisou (No awakening)
		//image_flg==59 ???
		//image_flg==63 Injured, Awakened, IA, Keisou {All}
        return this.image_flg==this.flg_max ? 1 : 0
      },
	  get yukata_img_flg () {
		return this.image_flg>31 ? 1 : 0
	  },
      get work_img_flg () {
        return this.image_flg>47 ? 1 : (((this.image_flg>15)&&(this.image_flg<35)) ? 1 : 0)
      },
      get serious_img_flg () {
        return (((this.image_flg+1)/8%2==0)||((this.image_flg+5)/8%2==0)) ? 1 : 0
      },
	  get injury_img_flg () {
		return ((this.image_flg+1)%8==0) ? 1 : 0
	  }
    }
  }
})
