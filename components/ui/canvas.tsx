'use strict';

import React from "react";

interface WaveConfig {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

interface LineConfig {
  spring: number;
}

interface CanvasContext extends CanvasRenderingContext2D {
  running?: boolean;
  frame?: number;
}

class Wave {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  value: number;

  constructor(config: WaveConfig = {}) {
    this.phase = config.phase || 0;
    this.offset = config.offset || 0;
    this.frequency = config.frequency || 0.001;
    this.amplitude = config.amplitude || 1;
    this.value = 0;
  }

  update() {
    this.phase += this.frequency;
    this.value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.value;
  }
}

class Node {
  x: number = 0;
  y: number = 0;
  vy: number = 0;
  vx: number = 0;
}

const CONFIG = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(config: LineConfig) {
    this.spring = config.spring + 0.1 * Math.random() - 0.05;
    this.friction = CONFIG.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];

    for (let i = 0; i < CONFIG.size; i++) {
      const node = new Node();
      node.x = pos.x;
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update() {
    let spring = this.spring;
    const firstNode = this.nodes[0];

    firstNode.vx += (pos.x - firstNode.x) * spring;
    firstNode.vy += (pos.y - firstNode.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      if (i > 0) {
        const prevNode = this.nodes[i - 1];
        node.vx += (prevNode.x - node.x) * spring;
        node.vy += (prevNode.y - node.y) * spring;
        node.vx += prevNode.vx * CONFIG.dampening;
        node.vy += prevNode.vy * CONFIG.dampening;
      }

      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= CONFIG.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const node = this.nodes[i];
      const nextNode = this.nodes[i + 1];
      x = (node.x + nextNode.x) * 0.5;
      y = (node.y + nextNode.y) * 0.5;
      ctx.quadraticCurveTo(node.x, node.y, x, y);
    }

    const secondLastNode = this.nodes[this.nodes.length - 2];
    const lastNode = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(secondLastNode.x, secondLastNode.y, lastNode.x, lastNode.y);
    ctx.stroke();
    ctx.closePath();
  }
}

const pos: { x: number; y: number } = { x: 0, y: 0 };
let lines: Line[] = [];

const Canvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasContext | null>(null);
  const waveRef = React.useRef<Wave | null>(null);

  const initLines = React.useCallback(() => {
    lines = [];
    for (let i = 0; i < CONFIG.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / CONFIG.trails) * 0.025 }));
    }
  }, []);

  const handleMouseMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
    e.preventDefault();
  }, []);

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }, []);

  const render = React.useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx || !ctx.running || !waveRef.current) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `hsla(${Math.round(waveRef.current.update())},100%,50%,0.025)`;
    ctx.lineWidth = 10;

    for (let i = 0; i < CONFIG.trails; i++) {
      const line = lines[i];
      line.update();
      line.draw(ctx);
    }

    ctx.frame!++;
    window.requestAnimationFrame(render);
  }, []);

  const resizeCanvas = React.useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;
    canvasRef.current.width = window.innerWidth - 20;
    canvasRef.current.height = window.innerHeight;
  }, []);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    contextRef.current = canvasRef.current.getContext('2d') as CanvasContext;
    if (!contextRef.current) return;

    contextRef.current.running = true;
    contextRef.current.frame = 1;

    waveRef.current = new Wave({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    document.body.addEventListener('orientationchange', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('focus', () => {
      if (contextRef.current && !contextRef.current.running) {
        contextRef.current.running = true;
        render();
      }
    });

    window.addEventListener('blur', () => {
      if (contextRef.current) {
        contextRef.current.running = true;
      }
    });

    initLines();
    resizeCanvas();
    render();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
      if (contextRef.current) {
        contextRef.current.running = false;
      }
    };
  }, [handleMouseMove, handleTouchStart, initLines, render, resizeCanvas]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
