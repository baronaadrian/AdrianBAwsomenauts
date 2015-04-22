game.GameTimerManager = Object.extend ({
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
            game.data.gold += (game.data.exp1+1);
            console.log("Current gold: " + game.data.gold);
        }
    },
    
    creepTimerCheck: function(){
                if(Math.round(this.now/ 600)%10 ===0 && (this.now - this.lastCreep >= 1000)){
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
      this.gameover = false; 
  },
  
  update: function(){
      if(game.data.win === true && !this.gameover){
         this.gameOver(true);
      }else if(game.data.win === false && !this.gameover){
        this.gameOver(false);
      }
            
      return true;
  },
  
  gameOver: function(win){
      if(win){
        game.data.exp += 10;
      }else{
        game.data.exp += 1;
      }
        console.log(game.data.exp)
        this.gameover = true;
        me.save.exp = game.data.exp;
     }
  
});

game.SpendGold = Object.extend({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
       
    update: function(){
        this.now = new Date().getTime();
        
       if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
           this.lastBuy = this.now;
           if(!this.buying){
               this.startBuying();
           }else{
               this.stopBuying();
           }
            
       }
       
        return true;
    },
    
    startBuying: function(){
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0,0);
        me.state.pause(me.state.PLAY);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    
    setBuyText: function(){
       game.data.buyText = new (me.Renderable.extend({
                   init:function(){
                       this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                       this.font = new me.Font("Arial",26, "white");
                       this.updateWhenPaused = true;
                       this.alwaysUpdate = true;
                   },
                   
                   draw: function(renderer){
                      this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT. Current Gold: " + game.data.gold, this.pos.x, this.pos.y);
                      this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level: " + game.data.skill1 + " Cost: " + ((game.data.exp1+1)*10),this.pos.x, this.pos.y + 40);
                      this.font.draw(renderer.getContext(), "Skill 2: Run Faster! Current Level: " + game.data.skill2 + " Cost: " + ((game.data.exp2+1)*10), this.pos.x, this.pos.y + 80);
                      this.font.draw(renderer.getContext(), "Skill 3:Increase Health. Current Level: " + game.data.skill3 + " Cost: " + ((game.data.exp1+1)*10), this.pos.x, this.pos.y + 120);
                      this.font.draw(renderer.getContext(), "Q Ability: Speed Burst. Current Level " + game.data.ability1 + " Cost: " + ((game.data.exp4+1)*10), this.pos.x, this.pos.y + 160);
                      this.font.draw(renderer.getContext(), "W Ability: Eat Your Creep For Health: " + game.data.ability2 + " Cost: " + ((game.data.exp5+1)*10), this.pos.x, this.pos.y + 200);
                      this.font.draw(renderer.getContext(), "E Ability: Throw YOur Spear: " + game.data.ability3 + " Cost: " + ((game.data.exp6+1)*10), this.pos.x, this.pos.y + 240);
                   }
        }));
        me.game.world.addChild(game.data.buyText, 35);
;    },
    
    stopBuying: function(){
         this.buying = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F2, "F2", true);
        me.input.unbindKey(me.input.KEY.F3, "F3", true);
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        me.game.world.removeChild(game.data.buyText);
    }
    
});

