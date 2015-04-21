'use strict';

import BoidSystem from './BoidSystem';

export default class BoidSystem3D extends BoidSystem {
  constructor({canvas, boidsNumber, normalsCanvas, depthCanvas}) {

    super({canvas, boidsNumber});

    this.wallsOffset = 20;

    if(normalsCanvas) {
      normalsCanvas.width = this.width;
      normalsCanvas.height = this.height;
      this.normalsContext = normalsCanvas.getContext('2d');
      this.normalsContext.fillStyle = 'rgb(128, 128, 255)';
      this.normalsContext.fillRect(0, 0, normalsCanvas.width, normalsCanvas.height);
      this.normalsContext.lineWidth = 3;
    }

    if(depthCanvas) {
      depthCanvas.width = this.width;
      depthCanvas.height = this.height;
      this.depthContext = depthCanvas.getContext('2d');
      this.depthContext.fillStyle = 'white';
      this.depthContext.fillRect(0, 0, depthCanvas.width, depthCanvas.height);
      this.depthContext.lineWidth = 3;
      this.depthContext.globalCompositeOperation = 'multiply';
    }
  }
  update () {
    super.update();

    if (this.depthContext) {
      let depthGradient = this.depthContext.createLinearGradient(-this.wallsOffset, 0, this.wallsOffset, 0);
      depthGradient.addColorStop(0, 'white');
      depthGradient.addColorStop(.5, 'black');
      depthGradient.addColorStop(1, 'white');
      this.depthContext.strokeStyle = depthGradient;
    }

    for(let boid of this.boids) {

      if (boid.isDead) {
        continue;
      }

      // Draw normals
      if (this.normalsContext) {
        this.normalsContext.save();
        let colorX = Math.round(((boid.offsetY + 1) / 2) * 255);
        let colorY = Math.round(((boid.offsetX + 1) / 2) * 255);
        let normalsGradient = this.normalsContext.createLinearGradient(-this.wallsOffset, 0, this.wallsOffset, 0);
        normalsGradient.addColorStop(0, 'rgba(128, 128, 255, 0)');
        normalsGradient.addColorStop(0.49, `rgb(${colorX}, ${colorY}, 128)`);
        normalsGradient.addColorStop(.5, 'rgb(128, 128, 255)');
        normalsGradient.addColorStop(0.51, `rgb(${255 - colorX}, ${255 - colorY}, 128)`);
        normalsGradient.addColorStop(1, 'rgba(128, 128, 255, 0)');
        this.normalsContext.strokeStyle = normalsGradient;
        this.normalsContext.translate(boid.x, boid.y);
        this.normalsContext.rotate(boid.angle + Math.PI * .5);
        this.normalsContext.beginPath();
        this.normalsContext.moveTo(-this.wallsOffset, 0);
        this.normalsContext.lineTo(this.wallsOffset, 0);
        this.normalsContext.stroke();
        this.normalsContext.restore();
      }

      if (this.depthContext) {
        this.depthContext.save();
        this.depthContext.translate(boid.x, boid.y);
        this.depthContext.rotate(boid.angle + Math.PI * .5);
        this.depthContext.beginPath();
        this.depthContext.moveTo(-this.wallsOffset, 0);
        this.depthContext.lineTo(this.wallsOffset, 0);
        this.depthContext.stroke();
        this.depthContext.restore();
      }
    }
  }
}