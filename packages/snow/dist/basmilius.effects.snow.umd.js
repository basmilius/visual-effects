!function(t,s){"object"==typeof exports&&"undefined"!=typeof module?s(exports,require("@basmilius/effects-common")):"function"==typeof define&&define.amd?define(["exports","@basmilius/effects-common"],s):s((t="undefined"!=typeof globalThis?globalThis:t||self).BMEffectsSnow={},t.BMEffectsCommon)}(this,(function(t,s){"use strict";const e=s.mulberry32();class i extends s.LimitedFrameRateCanvas{constructor(t){super(t,60),this.angle=0,this.ratio=1,this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.height="100%",this.canvas.style.width="100%",this.fillStyle=t.dataset.fillStyle||"rgb(255 255 255 / .75)",this.maxParticles=parseInt(t.dataset.particles||"200"),this.snowFlakes=[],this.speed=parseFloat(t.dataset.speed||"2.0"),this.isSmall&&(this.maxParticles/=2);for(let t=0;t<this.maxParticles;++t)this.snowFlakes.push({x:e.next(),y:e.next()-1,density:e.next()*this.maxParticles,radius:6*e.next()+2})}draw(){this.canvas.height=this.height,this.canvas.width=this.width,this.context.clearRect(0,0,this.width,this.height),this.context.fillStyle=this.fillStyle,this.context.beginPath(),this.snowFlakes.forEach((t=>{this.context.moveTo(t.x*this.width,t.y*this.height),this.context.arc(t.x*this.width,t.y*this.height,t.radius*this.ratio,0,2*Math.PI,!0)})),this.context.fill()}tick(){let t=this.height/(420*this.ratio)/this.speed*this.deltaFactor;this.angle+=.02*t,this.snowFlakes.forEach(((s,i)=>{s.x+=2*Math.sin(this.angle+s.density)/(5e3*t),s.y+=(Math.cos(this.angle+s.density)+1+s.radius/2)/(1e3*t),(s.x>1.05||s.x<-.05||s.y>1.05)&&(i%3>0?(this.snowFlakes[i].x=e.next(),this.snowFlakes[i].y=-.05):Math.sin(this.angle)>0?(this.snowFlakes[i].x=-.05,this.snowFlakes[i].y=e.next()):(this.snowFlakes[i].x=1.05,this.snowFlakes[i].y=e.next()))}))}}t.SnowSimulation=i,Object.defineProperty(t,"__esModule",{value:!0})}));//# sourceMappingURL=basmilius.effects.snow.umd.js.map