import{mulberry32 as t,distance as i,LimitedFrameRateCanvas as s}from"@basmilius/effects-common";const e=t();class h extends EventTarget{constructor(t,i,s){for(super(),this.friction=.95,this.gravity=1,this.trail=[],this.trailMemory=5,this.position=Object.assign({},t),this.alpha=1,this.angle=e.nextBetween(0,2*Math.PI),this.brightness=e.nextBetween(50,80),this.decay=e.nextBetween(.015,.03),this.hue=i+e.nextBetween(-50,50),this.lineWidth=s,this.speed=e.nextBetween(1,10);this.trailMemory--;)this.trail.push(Object.assign({},t))}draw(t){const i=this.trail[this.trail.length-1];t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(this.position.x,this.position.y),t.lineCap="round",t.lineWidth=this.lineWidth,t.strokeStyle=`hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`,t.stroke()}tick(){this.trail.pop(),this.trail.unshift(Object.assign({},this.position)),this.speed*=this.friction,this.position.x+=Math.cos(this.angle)*this.speed,this.position.y+=Math.sin(this.angle)*this.speed+this.gravity,this.alpha-=this.decay,this.alpha<=this.decay&&this.dispatchEvent(new CustomEvent("remove"))}}class n extends EventTarget{constructor(t,s,h,n){for(super(),this.acceleration=1.05,this.brightness=e.nextBetween(50,70),this.distanceTraveled=0,this.speed=1,this.targetRadius=1,this.trail=[],this.trailMemory=3,this.hue=h,this.lineWidth=n,this.position=Object.assign({},t),this.startPosition=Object.assign({},t),this.targetPosition=Object.assign({},s),this.angle=Math.atan2(s.y-t.y,s.x-t.x),this.distance=i(t,s);this.trailMemory--;)this.trail.push(Object.assign({},t))}draw(t){const i=this.hue+e.nextBetween(-50,50),s=this.trail[this.trail.length-1];t.beginPath(),t.moveTo(s.x,s.y),t.lineTo(this.position.x,this.position.y),t.lineCap="round",t.lineWidth=this.lineWidth,t.strokeStyle=`hsl(${i}, 100%, ${this.brightness}%)`,t.stroke()}tick(){this.trail.pop(),this.trail.unshift(Object.assign({},this.position)),this.targetRadius<8?this.targetRadius+=.3:this.targetRadius=1,this.speed*=this.acceleration;let t=Math.cos(this.angle)*this.speed,s=Math.sin(this.angle)*this.speed;this.distanceTraveled=i(this.startPosition,{x:this.position.x+t,y:this.position.y+s}),this.distanceTraveled>=this.distance?this.dispatchEvent(new CustomEvent("remove")):(this.position.x+=t,this.position.y+=s)}}class o extends s{constructor(t,i=6){super(t,60),this.hue=120,this.positionRandom=e.fork(),this.explosions=[],this.fireworks=[],this.lineWidth=i,this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.height="100%",this.canvas.style.width="100%"}draw(){this.canvas.height=this.height,this.canvas.width=this.width,this.context.globalCompositeOperation="destination-out",this.context.fillStyle="rgba(0, 0, 0, 0.5)",this.context.fillRect(0,0,this.width,this.height),this.context.globalCompositeOperation="lighter",this.explosions.forEach((t=>t.draw(this.context))),this.fireworks.forEach((t=>t.draw(this.context)))}tick(){if(this.fireworks.length<6&&this.ticks%(this.isSmall?60:30)==0){let t=e.nextBetween(1,100)<10?2:1;for(;t--;)this.hue=e.nextBetween(0,360),this.createFirework()}this.explosions.forEach((t=>t.tick())),this.fireworks.forEach((t=>t.tick()))}createExplosion(t,i){let s=30;for(;s--;){const s=new h(t,i,this.lineWidth);s.addEventListener("remove",(()=>this.explosions.splice(this.explosions.indexOf(s),1)),{once:!0}),this.explosions.push(s)}}createFirework(){const t=this.hue,i=this.positionRandom.nextBetween(100,this.width-100),s=.1*this.height+this.positionRandom.nextBetween(0,.5*this.height),e=new n({x:.5*i+innerWidth/4,y:this.height},{x:i,y:s},t,this.lineWidth);e.addEventListener("remove",(()=>{this.fireworks.splice(this.fireworks.indexOf(e),1),this.createExplosion(e.position,t)}),{once:!0}),this.fireworks.push(e)}}export{o as FireworkSimulation};//# sourceMappingURL=basmilius.effects.fireworks.es.js.map
