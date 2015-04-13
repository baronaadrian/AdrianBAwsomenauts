game.GameTimeManager = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    update: function(){
         this.now = new Date() .getTime();
         this.goldTimerCheck();
         this.creepTimerCheck();        
          
        return true;
    },
    
    goldTimerCheck: function(){
        if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
            game.data.gold += 1;
            console.log("Current gold: " + game.data.gold);
        }
    },
    
    creepTimerCheck: function(){
                if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);            
        }
    }
});

game.HeroDeathManager = Object.extend({
    init: function(x, y, settings){
        this.alwaysUpdate = true;
    },
    
    update: function(){
        if(game.data.player.dead){
        me.game.world.removeChild(game.data.player );
        me.state.current().resetPlayer(10, 0); 
      }
      
      return true;
    }
});

game.ExperienceManager = Object.extend({
  init: function(x, y, settings){
      this.alwaysUpdate = true;
  },
  
  update: function(){
      if(game.data.win === true){
          game.data.exp += 10;
      }else if(game.data.win === false){
          game.data.exp += 1;
      }
      
      return true;
  }
  
});

