// console.log(gsap);
const canvas =document.querySelector("canvas");
canvas.height =innerHeight;
canvas.width = innerWidth;


const ctx =canvas.getContext("2d");

class Player {
    constructor(x,y,radius,color){
        this.x=x
        this.y=y
        this.color=color
        this.radius=radius
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle=this.color
        ctx.fill()
    }
}

class Projectile{
    constructor(x,y,radius,color,velocity){
            this.x=x;
            this.y=y;
            this.color=color;
            this.radius=radius;
            this.velocity=velocity;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle=this.color
        ctx.fill()
    }
    update(){
        this.draw();
        this.x +=this.velocity.x;
        this.y+=this.velocity.y;
    }
    
 

}
class Enemy{
    constructor(x,y,radius,color,velocity){
            this.x=x;
            this.y=y;
            this.color=color;
            this.radius=radius;
            this.velocity=velocity;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle=this.color
        ctx.fill()
    }
    update(){
        this.draw();
        this.x +=this.velocity.x;
        this.y+=this.velocity.y;
    }
    
 

}
const friction=.97;
class Particle{
    constructor(x,y,radius,color,velocity){
            this.x=x;
            this.y=y;
            this.color=color;
            this.radius=radius;
            this.velocity=velocity;
            this.aplha=1;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha=this.aplha
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle=this.color
        ctx.fill()
        ctx.restore();
    }
    update(){
        this.draw();
        this.velocity.x*=friction;
        this.velocity.y*=friction;
        this.x +=this.velocity.x;
        this.y+=this.velocity.y;
        this.aplha-=0.01;
        
    }
    
 

}


let score=0;
const x= canvas.width/2;
const y = canvas.height/2;
const player =new Player(x,y,30,'white');
player.draw();  

// const projectile = new Projectile(canvas.width/2,canvas.height/2,10,'black',{x:1,y:1});
// const projectile1 = new Projectile(canvas.width/2,canvas.height/2,10,'green',{x:-1,y:-1});
    
const projectiles= [];
const enemies= [];
const particles= [];


function spawnEnemies(){
    setInterval(()=>{
        const radius=Math.random()*(30-10) + 10;
        let x;
        let y;
        if(Math.random() <0.5){
         x=Math.random()<0.5?0-radius:canvas.width+radius;
         y=Math.random()*canvas.height;        
        }else{
            y=Math.random()<0.5?0-radius:canvas.height+radius;
            x=Math.random()*canvas.width;  
        }
        const color=`hsl(${Math.random()*360},50%,50%)`;
        const angle =Math.atan2(canvas.height/2-y,canvas.width/2-x);
        const velocity={
        x:Math.cos(angle),
        y:Math.sin(angle)
        }
          enemies.push(
              new Enemy(x,y,radius,color,velocity)
          );
          console.log("go");
    },1000)
}

let animationId;
function animate(){
    document.querySelector(".score").innerHTML=score;
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle='rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    player.draw();  
    projectiles.forEach(projectile=>{
        projectile.update();
    })
    particles.forEach((particle,index)=>{
        if(particle.aplha<=0){
            particles.splice(index,1);
        }else{
          particle.update();
        }
    })
    enemies.forEach((enemy,index)=>{
        enemy.update();

        const distplayer=Math.hypot(player.x-enemy.x,player.y-enemy.y);
        if(distplayer<player.radius+enemy.radius){
            cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile,indexp)=>{
            if(projectile.x+projectile.radius<0||
            projectile.x-projectile.radius>canvas.width||
            projectile.y+projectile.radius<0||
            projectile.y+projectile.radius>canvas.height
            ){
                projectiles.splice(indexp,1);
            }


            const dist =Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y);
            if(dist<projectile.radius+enemy.radius){
         
                for(let i=0;i<enemy.radius*2;i++){
                 let radiusp=Math.random()*(3-1)+1
                 particles.push(new Particle(projectile.x,projectile.y,radiusp,enemy.color,{x:(Math.random()-.5) *8,y:(Math.random()-.5 )*8}))

                }

                if(enemy.radius-10 >10){
                    score+=10;
                    gsap.to(enemy,{
                        radius:enemy.radius-10
                    })
                    setTimeout(() => {
                            projectiles.splice(indexp,1);
                    }, 0);
                   
                }else{
                score+=20;
                setTimeout(() => {
                    enemies.splice(index,1);
                    projectiles.splice(indexp,1);
                }, 0);
            }
               
            }
        })
    })
}





window.addEventListener('click',(e)=>{

    const angle =Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    const velocity={
        x:Math.cos(angle)*4,
        y:Math.sin(angle)*4
    }
     projectiles.push(

        new Projectile(canvas.width/2,canvas.height/2,10,'white',velocity)
    
     )
})

animate();
spawnEnemies();