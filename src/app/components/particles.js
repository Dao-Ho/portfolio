"use client";
import React, { useRef, useEffect } from "react";

const ParticleEffect = ({ isLight }) => {
    const canvasRef = useRef(null);
    //stores particle array so it doesn't need to re-render everytime the component updates
    const particlesArrayRef = useRef([]);
    const ctxRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const mouse = { x: null, y: null, radius: 10000 };
        const gap = 15;
        const particlesArray = particlesArrayRef.current;
        ctxRef.current = ctx;

        //resive canvas to fit current viewport
        const resizeCanvas = () => {
            const oldWidth = canvas.width;
            const oldHeight = canvas.height;

            //new sizes
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            //find ratio of new size relative to old
            const widthRatio = canvas.width / oldWidth;
            const heightRatio = canvas.height / oldHeight;

            //update the particles by increasing them by said factor
            particlesArray.forEach((particle) => {
                particle.x *= widthRatio;
                particle.y *= heightRatio;
                particle.baseX *= widthRatio;
                particle.baseY *= heightRatio;
            });
        };

        //update coordinate to track mouse position
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        //update coordinate to track touch position
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouse.x = touch.clientX;
                mouse.y = touch.clientY;
            }
        };

        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            //initialize each particle with base velocity of 0, random sizing, friction, and ease
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = 1;
                this.baseX = x;
                this.baseY = y;
                this.vx = 0;
                this.vy = 0;
                this.ease = 0.2;
                this.friction = 0.95;
                this.color = isLight ? "#262523" : "#fff7f0";
            }

            //draw each particle as a black square
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 3);
                ctx.closePath();
                ctx.fill();
            }

            //update particle position relative to mouse position and movement.
            //velocity of the particle pushed away from the mouse calculated using the distance between cursor and particle, as well as the angle the mouse is coming from
            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = dx * dx + dy * dy;
                const force = -mouse.radius / distance;

                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    this.vx += force * Math.cos(angle);
                    this.vy += force * Math.sin(angle);
                }

                this.x += (this.vx *= this.friction) + (this.baseX - this.x) * this.ease;
                this.y += (this.vy *= this.friction) + (this.baseY - this.y) * this.ease;

                this.draw();
            }

            setColor(newColor) {
                this.color = newColor;
            }
        }

        //initialize each particle in a grid pattern, space between determined by gap
        const initParticles = () => {
            particlesArray.length = 0;
            for (let x = 0; x < canvas.width; x += gap) {
                for (let y = 0; y < canvas.height; y += gap) {
                    particlesArray.push(new Particle(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach((particle) => particle.update());
            requestAnimationFrame(animate);
        };

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const particlesArray = particlesArrayRef.current;
        const newColor = isLight ? "#262523" : "#fff7f0";
        particlesArray.forEach((particle) => particle.setColor(newColor));
    }, [isLight]);

    return (
        //set canvas to size of viewport and ensure it's the bottom layer
        <canvas ref={canvasRef} className="w-[100vw] h-full fixed top-0 left-0 z-0" />
    );
};

export default ParticleEffect;
