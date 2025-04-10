let agentID = 0

class Agent {
  constructor(x, y, options) {
    this.position = {x: x, y: y};    
    this.angle = Math.random(3.142 * 2);

    this.sensorDistanceBase = options.sensorDistanceBase;
    this.sensorDistanceExponent = options.sensorDistanceExponent;
    this.sensorDistanceMultiplier = options.sensorDistanceMultiplier;
    this.sensorAngleBase = options.sensorAngleBase;
    this.sensorAngleExponent = options.sensorAngleExponent;
    this.sensorAngleMultiplier = options.sensorAngleMultiplier;
    this.turnAngleBase = options.turnAngleBase;
    this.turnAngleExponent = options.turnAngleExponent;
    this.turnAngleMultiplier = options.turnAngleMultiplier;
    this.speedBase = options.speedBase;
    this.speedExponent = options.speedExponent;
    this.speedpMultiplier = options.speedpMultiplier;

    this.speed = this.set_speed();
    this.sensorDistance = this.set_sensorDistance();
    this.sensorAngle = this.set_sensorAngle();
    this.turnAngle = this.set_turnAngle();
    this.agentID  = agentID;
    agentID++;
  }

  edges(){
    if(this.position.x > renderSize) this.position.x = 0;
    if(this.position.x < 0) this.position.x = renderSize;
    if(this.position.y > renderSize) this.position.y = 0;
    if(this.position.y < 0) this.position.y = renderSize;

  }

  set_speed(){
    return this.speedBase * Math.pow(this.speedExponent, this.speedpMultiplier);
  }

  set_sensorDistance(){
    return this.sensorDistanceBase * Math.pow(this.sensorDistanceExponent, this.sensorDistanceMultiplier);
  }

  set_sensorAngle(){
    return this.sensorAngleBase * Math.pow(this.sensorAngleExponent, this.sensorAngleMultiplier);
  }

  set_turnAngle(){
    return this.turnAngleBase * Math.pow(this.turnAngleExponent, this.turnAngleMultiplier);
  }

  update() {
    this.edges();
    let left = this.sense(this.sensorAngle);
    let center = this.sense(0);
    let right = this.sense(-this.sensorAngle);

    if (center > left && center > right) {
      console.log("center");
    } else if (left > right) {
      console.log("left");
      this.angle += this.turnAngle;
    } else if (right > left) {
      console.log("right");
      this.angle -= this.turnAngle;
    } else {
    }


    this.position.x += Math.cos(this.angle) * this.speed;
    this.position.y += Math.sin(this.angle) * this.speed;

  }

  sense(offsetAngle) {
    let sensorDir = this.angle + offsetAngle;
    let sensorX = this.position.x  + Math.cos(sensorDir) * this.sensorDistance;
    let sensorY = this.position.y  + Math.sin(sensorDir) * this.sensorDistance;
    let idx = Math.floor(sensorX) + Math.floor(sensorY) * renderSize;
    if(this.agentID == 0) {
    }
    if (sensorX >= 0 && sensorX < renderSize && sensorY >= 0 && sensorY < renderSize) {
      let v = pixels[idx * 4 + 3]
      return v
    }
    return 0;
  }

  deposit() {
    let i = floor(this.position.x / resolution);
    let j = floor(this.position.y / resolution);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      // this.group.trailMap[i][j] = constrain(this.group.trailMap[i][j] + 10, 0, 255);
    }
  }

 
}

let agents = []

create_agents();

let pixels = new Float32Array(renderSize * renderSize * 4); 

function read_pixels(){
  gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer)
  gl.readPixels(0, 0, renderSize, renderSize, gl.RGBA, gl.FLOAT, pixels);
}


function update_agents(){
  for (let j = 0; j < agents.length; ++j) {
    let agent = agents[j];
    agent.edges();

    agent.update();
    // agent.deposit();
  }
}

function move_agents(){
  for (let j = 0; j < agents.length; ++j) {
    particle_data[j]   = agents[j].position.x/(renderSize/2) - 1;
    particle_data[j+1] = agents[j].position.y/(renderSize/2) - 1;
  }
}


function create_agents(){
  for (let j = 0; j < n * n; ++j) {
    let x = 2 * Math.random() - 1
    let y = 2 * Math.random() - 1
    
    let agent = new Agent(x * renderSize, y * renderSize, currentPreset)
      
    agents.push(agent);
  }
}
