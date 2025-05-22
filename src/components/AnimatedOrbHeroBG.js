import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useOrbContext } from "./OrbContextProvider";

const AnimatedOrbHeroBG = ({
  style = {},
  className = "",
  zIndex = 0,
  visible = true,
  sx = {},
  disperse = false,
}) => {
  // --- Interactive Orb Ripple/Jump State ---
  const [ripples, setRipples] = useState([]); // {cx, cy, r, color, width, opacity}
  const [orbJump, setOrbJump] = useState({}); // {orbIdx, dx, dy, t, active}
  const [hoveredOrb, setHoveredOrb] = useState(null);
  
  // --- Enhanced User Interaction State ---
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [orbInteractions, setOrbInteractions] = useState({});
  const [magneticInfluence, setMagneticInfluence] = useState({});
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dataFlowActive, setDataFlowActive] = useState(false);

  // --- Orbital Return State ---
  const [orbDisplacements, setOrbDisplacements] = useState({}); // {orbId: {dx, dy, decay}}

  // Animate ripples
  useEffect(() => {
    if (!ripples.length) return;
    let raf;
    function animate() {
      setRipples(prev => prev
        .map(r => ({ ...r, r: r.r + 3, opacity: r.opacity * 0.93 }))
        .filter(r => r.opacity > 0.04)
      );
      if (ripples.length) raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [ripples.length]);

  // Animate orbital displacements with return behavior
  useEffect(() => {
    if (Object.keys(orbDisplacements).length === 0) return;
    let raf;
    function animate() {
      setOrbDisplacements(prev => {
        const updated = {};
        let hasActive = false;
        for (const [orbId, displacement] of Object.entries(prev)) {
          const newDx = displacement.dx * displacement.decay;
          const newDy = displacement.dy * displacement.decay;
          if (Math.abs(newDx) > 0.1 || Math.abs(newDy) > 0.1) {
            updated[orbId] = { dx: newDx, dy: newDy, decay: displacement.decay };
            hasActive = true;
          }
        }
        return hasActive ? updated : {};
      });
      if (Object.keys(orbDisplacements).length > 0) {
        raf = requestAnimationFrame(animate);
      }
    }
    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [Object.keys(orbDisplacements).length]);

  // Animation state: 'idle', 'dispersing', 'assembling'
  const [animState, setAnimState] = useState('idle');
  const [animProgress, setAnimProgress] = useState(0); // 0 to 1
  const prevDisperse = useRef(disperse);
  const disperseDirs = useRef([]); // {angle, dist}
  const assembleOffsets = useRef([]); // {x, y}
  const animationDuration = 700; // ms

  // Detect disperse prop change
  useEffect(() => {
    if (disperse !== prevDisperse.current) {
      if (disperse) {
        // Start dispersing
        disperseDirs.current = [];
        for (let i = 0; i < 6; i++) {
          disperseDirs.current.push({
            angle: Math.random() * 2 * Math.PI,
            dist: 180 + Math.random() * 120
          });
        }
        setAnimState('dispersing');
        setAnimProgress(0);
      } else {
        // Start assembling (from below viewport)
        assembleOffsets.current = [];
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
        for (let i = 0; i < 6; i++) {
          const xoff = (Math.random() - 0.5) * vw * 0.25;
          const yoff = vh * 0.5 + 80 + Math.random() * vh * 0.25;
          assembleOffsets.current.push({ x: xoff, y: yoff });
        }
        setAnimState('assembling');
        setAnimProgress(0);
      }
      prevDisperse.current = disperse;
    }
  }, [disperse]);

  // Animate dispersal/assembly
  useEffect(() => {
    if (animState === 'idle') return;
    let raf;
    const start = performance.now();
    function step() {
      const elapsed = performance.now() - start;
      let t = Math.min(1, elapsed / animationDuration);
      setAnimProgress(t);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        if (animState === 'dispersing') setAnimState('idle');
        if (animState === 'assembling') setAnimState('idle');
      }
    }
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [animState]);

  // --- Enhanced Mouse Tracking ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollVelocity(Math.abs(currentScrollY - lastScrollY));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Enhanced click handler with orbital displacement
  const handleOrbClick = (x, y, orbIndex = 0) => {
    // Create multiple ripple waves
    setRipples(prev => [...prev, 
      {cx: x, cy: y, r: 0, color: '#00ffc6', width: 4, opacity: 1},
      {cx: x, cy: y, r: 0, color: '#7B42F6', width: 3, opacity: 0.8},
      {cx: x, cy: y, r: 0, color: '#3a86ff', width: 2, opacity: 0.6}
    ]);

    // Create temporary orbital displacement with return behavior
    const displacementMagnitude = 25 + Math.random() * 15;
    const displacementAngle = Math.random() * 2 * Math.PI;
    const dx = Math.cos(displacementAngle) * displacementMagnitude;
    const dy = Math.sin(displacementAngle) * displacementMagnitude;
    
    setOrbDisplacements(prev => ({
      ...prev,
      [orbIndex]: { dx, dy, decay: 0.92 } // Smooth return with 92% decay per frame
    }));

    // Trigger data flow effect
    setDataFlowActive(true);
    setTimeout(() => setDataFlowActive(false), 2000);
  };

  const svgRef = useRef(null);
  const parentOrbRef = useRef(null);
  const childrenGroupRef = useRef(null);
  const particlesGroupRef = useRef(null);
  const particlesRef = useRef([]); // Particle state
  // Get the context for sharing orb colors
  const { updateGradientColors } = useOrbContext();

  // --- Animation and Orb Logic ---
  useEffect(() => {
    if (!visible) return;
    let animationFrame;
    // --- Utility Functions ---
    function hslToHex(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
    }
    function lerpColor(a, b, t) {
      const ah = parseInt(a.replace('#', ''), 16), bh = parseInt(b.replace('#', ''), 16);
      const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
      const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
      const rr = Math.round(ar + (br - ar) * t);
      const rg = Math.round(ag + (bg - ag) * t);
      const rb = Math.round(ab + (bb - ab) * t);
      return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1);
    }
    function generateSuperSmoothBlob(cx, cy, r, points, t, amp = 1, phase = 0, magneticX = 0, magneticY = 0) {
      const pts = [];
      // Generate more points for ultra-smooth appearance
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        // Use gentler, lower-frequency variations with reduced amplitude
        // for a more naturally smooth spherical appearance
        const noise =
          Math.sin(angle * 2 + t * 0.4 + phase) * 1.8 * amp +
          Math.sin(angle * 3 - t * 0.5 + phase) * 1.2 * amp +
          Math.sin(angle * 5 + t * 0.7 + phase) * 0.5 * amp;
        
        // Add magnetic influence (reduced to maintain orbital stability)
        const magneticInfluence = Math.exp(-((magneticX * magneticX + magneticY * magneticY) / 10000)) * 4;
        const magneticNoise = magneticInfluence * Math.sin(angle + t * 0.3);
        
        const rad = r + noise + magneticNoise;
        pts.push({
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad
        });
      }
      let d = "";
      for (let i = 0; i < points; i++) {
        const p0 = pts[(i - 1 + points) % points];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % points];
        const p3 = pts[(i + 2) % points];
        if (i === 0) {
          d += `M${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
        }
        // Use gentler control point positioning (1/3 instead of 1/6)
        // for smoother transitions between points
        const c1x = p1.x + (p2.x - p0.x) / 3;
        const c1y = p1.y + (p2.y - p0.y) / 3;
        const c2x = p2.x - (p3.x - p1.x) / 3;
        const c2y = p2.y - (p3.y - p1.y) / 3;
        d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
      }
      d += "Z";
      return d;
    }
    // --- Orb State ---
    const childCount = 5;
    const parentRadius = 60; // Reduced to 60% of original size
    const childRadius = 22; // Proportionally reduced
    const parentPoints = 144; // Significantly increased for ultra-smooth parent orb
    const childPoints = [120, 128, 124, 132, 126]; // Significantly increased for ultra-smooth child orbs
    const parentAmp = 0.5; // Further reduced amplitude for more spherical shape
    const childAmps = [0.25, 0.28, 0.22, 0.26, 0.24]; // Further reduced amplitudes for smoother shapes
    const childGradIds = [
      "childGrad0", "childGrad1", "childGrad2", "childGrad3", "childGrad4"
    ];
    // Morph personalities
    const orbMorphDirections = [Math.PI / 2];
    const orbMorphSpeeds = [0.012];
    for (let i = 0; i < childCount; i++) {
      const angle = Math.PI / 2 + (i - (childCount - 1) / 2) * (Math.PI / 8) + (Math.random() - 0.5) * (Math.PI / 12);
      orbMorphDirections.push(angle);
      orbMorphSpeeds.push(0.014 + i * 0.004 + Math.random() * 0.003);
    }
    const orbStates = [];
    function makeOrbState() {
      return { drag: 0, dragTarget: 0, dragV: 0, squash: 0, squashTarget: 0, squashV: 0, mouseDir: 0, mouseDirTarget: 0, mouseDirV: 0, wobble: 0, lastUpdate: performance.now() };
    }
    orbStates.push(makeOrbState());
    for (let i = 0; i < childCount; i++) orbStates.push(makeOrbState());
    // --- Enhanced Particle System ---
    function emitParticles(x, y, color, count = 3) {
      const particleCount = dataFlowActive ? count * 3 : count;
      for (let j = 0; j < particleCount; j++) {
        let h = (Math.random() * 360);
        let s = 85 + Math.random() * 10;
        let l = 55 + Math.random() * 20;
        const particleColor = hslToHex(h, s, l);
        const angle = Math.random() * 2 * Math.PI;
        const speed = (0.4 + Math.random() * 0.7) * (dataFlowActive ? 2 : 1);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particlesRef.current.push({
          x, y,
          vx, vy,
          r: (1.1 + Math.random() * 1.2) * (dataFlowActive ? 1.5 : 1),
          life: 0.6 * (dataFlowActive ? 1.5 : 1),
          decay: 0.025 + Math.random() * 0.015,
          color: particleColor,
          opacity: 0.45 * (dataFlowActive ? 1.3 : 1)
        });
      }
    }
    // --- Animation Loop ---
    function animate() {
      const svg = svgRef.current;
      if (!svg) return;
      const now = performance.now();
      
      // Calculate magnetic influence from mouse (reduced for stability)
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const centerX = vw / 2;
      const centerY = vh * 0.3;
      const mouseInfluenceX = (mousePos.x - centerX) * 0.05; // Reduced from 0.1
      const mouseInfluenceY = (mousePos.y - centerY) * 0.05; // Reduced from 0.1
      
      // Keep original gradient colors (no dynamic changes)
      updateGradientColors({ start: '#00E5FF', end: '#5B3CFF' });
      
      // --- Parent Orb with Enhanced Interactions ---
      const parentState = orbStates[0];
      const parentMorphT = now * (0.0004 + scrollVelocity * 0.00001);
      const parentDrag = parentState.drag;
      const parentAngle = orbMorphDirections[0];
      const parentDx = Math.cos(parentAngle) * parentDrag + mouseInfluenceX * 0.15; // Reduced influence
      const parentDy = Math.sin(parentAngle) * parentDrag + mouseInfluenceY * 0.15; // Reduced influence
      
      // Base orbital position
      let px = vw / 2 + Math.sin(now * 0.00011) * vw * 0.09 + Math.cos(now * 0.00007) * vw * 0.07;
      let py = vh * 0.3 + Math.cos(now * 0.00009) * vh * 0.08 + Math.sin(now * 0.00016) * vh * 0.06;
      let parentOpacity = 0.95;
      
      // Apply displacement if exists
      const parentDisplacement = orbDisplacements[0];
      if (parentDisplacement) {
        px += parentDisplacement.dx;
        py += parentDisplacement.dy;
      }
      
      if (animState === 'dispersing') {
        const d = disperseDirs.current[0] || {angle: 0, dist: 250};
        px += Math.cos(d.angle) * d.dist * animProgress;
        py += Math.sin(d.angle) * d.dist * animProgress;
        parentOpacity = 0.95 * (1 - animProgress);
      } else if (animState === 'assembling') {
        const o = assembleOffsets.current[0] || {x: 0, y: vh * 0.8};
        px += o.x * (1 - animProgress);
        py += o.y * (1 - animProgress);
        parentOpacity = 0.95 * animProgress;
      }
      
      const parentR = parentRadius * (dataFlowActive ? 1.05 : 1); // Reduced scale effect
      const parentPath = generateSuperSmoothBlob(
        px + parentDx, 
        py + parentDy, 
        parentR, 
        parentPoints, 
        parentMorphT, 
        parentAmp,
        0,
        mouseInfluenceX,
        mouseInfluenceY
      );
      
      if (parentOrbRef.current) {
        parentOrbRef.current.setAttribute('d', parentPath);
        parentOrbRef.current.setAttribute('opacity', parentOpacity);
      }
      
      // --- Children with Enhanced Interactions ---
      const childrenGroup = childrenGroupRef.current;
      if (childrenGroup) {
        while (childrenGroup.firstChild) childrenGroup.removeChild(childrenGroup.firstChild);
        for (let i = 0; i < childCount; i++) {
          let childPx, childPy, childOpacity = 0.95;
          
          // Enhanced orbital motion with mouse influence (reduced)
          const baseAngle = (now * (0.00022 + scrollVelocity * 0.000001) + i * (2 * Math.PI / childCount));
          const minEdge = Math.min(px, vw - px, py, vh - py);
          const maxChildOrbit = Math.max(40, minEdge - parentR - childRadius - 16);
          const orbitPhase = now * (0.00012 + 0.00007 * i) + i * 1.13;
          const orbitWobble = Math.sin(orbitPhase) * 0.18 + Math.cos(orbitPhase * 0.7) * 0.09;
          const minOrbit = parentR + childRadius + 12;
          let rawOrbit = (parentR + 60 + (i * 0.71 + 1.4) * maxChildOrbit / childCount) * (0.7 + 0.23 * orbitWobble);
          const orbitRadius = Math.max(rawOrbit, minOrbit);
          
          const ellipseA = orbitRadius * 1.3 * (0.97 + 0.07 * Math.sin(now * 0.00013 + i));
          const ellipseB = orbitRadius * 1.1 * (0.97 + 0.07 * Math.cos(now * 0.00016 + i * 2));
          const angle = baseAngle + Math.sin(now * 0.00009 + i * 1.7) * 0.22;
          
          // Base orbital position
          childPx = px + Math.cos(angle) * ellipseA + mouseInfluenceX * 0.1; // Reduced influence
          childPy = py + Math.sin(angle) * ellipseB + mouseInfluenceY * 0.1; // Reduced influence
          
          // Apply displacement if exists
          const childDisplacement = orbDisplacements[i + 1];
          if (childDisplacement) {
            childPx += childDisplacement.dx;
            childPy += childDisplacement.dy;
          }
          
          if (animState === 'dispersing') {
            const d = disperseDirs.current[i+1] || {angle: 0, dist: 250};
            childPx += Math.cos(d.angle) * d.dist * animProgress;
            childPy += Math.sin(d.angle) * d.dist * animProgress;
            childOpacity = 0.95 * (1 - animProgress);
          } else if (animState === 'assembling') {
            const o = assembleOffsets.current[i+1] || {x: 0, y: vh * 0.8};
            childPx += o.x * (1 - animProgress);
            childPy += o.y * (1 - animProgress);
            childOpacity = 0.95 * animProgress;
          }
          
          const cR = childRadius * (dataFlowActive ? 1.05 : 1); // Reduced scale effect
          const cAmp = childAmps[i];
          const morphT = now * 0.0005 + i * 10;
          const childPath = generateSuperSmoothBlob(
            childPx, 
            childPy, 
            cR, 
            childPoints[i], 
            morphT, 
            cAmp, 
            i,
            mouseInfluenceX * 0.25, // Reduced influence
            mouseInfluenceY * 0.25  // Reduced influence
          );
          
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", childPath);
          path.setAttribute("fill", `url(#${childGradIds[i]})`);
          path.setAttribute("opacity", childOpacity);
          path.style.cursor = 'pointer';
          path.style.pointerEvents = 'all';
          
          // Add click handler to child orbs
          path.addEventListener('click', (e) => {
            e.stopPropagation();
            handleOrbClick(childPx, childPy, i + 1);
          });
          
          childrenGroup.appendChild(path);
          
          // Reduced particle emission
          if (dataFlowActive && Math.random() < 0.3) {
            emitParticles(childPx, childPy, '#00E5FF', 1);
          }
        }
      }
      
      // --- Animate and Render Particles ---
      const particlesGroup = particlesGroupRef.current || svg.querySelector('#particles');
      if (particlesGroup) {
        let newParticles = [];
        particlesGroup.innerHTML = '';
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.life -= p.decay;
          p.opacity = Math.max(0, p.life);
          if (p.life > 0) {
            const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circ.setAttribute("cx", p.x);
            circ.setAttribute("cy", p.y);
            circ.setAttribute("r", p.r * p.opacity);
            circ.setAttribute("fill", p.color);
            circ.setAttribute("opacity", p.opacity * 0.7);
            particlesGroup.appendChild(circ);
            newParticles.push(p);
          }
        }
        particlesRef.current = newParticles;
      }
      
      // Render ripples
      const ripplesGroup = svg.querySelector('#ripples') || (() => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = 'ripples';
        svg.appendChild(g);
        return g;
      })();
      
      ripplesGroup.innerHTML = '';
      for (const ripple of ripples) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", ripple.cx);
        circle.setAttribute("cy", ripple.cy);
        circle.setAttribute("r", ripple.r);
        circle.setAttribute("stroke", ripple.color);
        circle.setAttribute("stroke-width", ripple.width);
        circle.setAttribute("fill", "none");
        circle.setAttribute("opacity", ripple.opacity);
        ripplesGroup.appendChild(circle);
      }
      
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [visible, mousePos, scrollVelocity, dataFlowActive, orbDisplacements]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        pointerEvents: "none",
        ...sx,
      }}
      style={style}
      className={className}
    >
      <svg
        ref={svgRef}
        width="100vw"
        height="100vh"
        style={{ display: "block", background: "transparent" }}
        viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1920} ${typeof window !== 'undefined' ? window.innerHeight : 1080}`}
      >
        <defs>
          <radialGradient id="parentGrad" cx="40%" cy="40%" r="80%">
            <stop id="p0" offset="0%" stopColor="#00E5FF" />
            <stop id="p1" offset="100%" stopColor="#5B3CFF" />
            <stop id="p2" offset="50%" stopColor="#00E5FF" />
            <stop id="p3" offset="75%" stopColor="#5B3CFF" />
          </radialGradient>
          <radialGradient id="childGrad0" cx="35%" cy="35%" r="80%">
            <stop id="c0s0" offset="0%" stopColor="#B3D8FF" />
            <stop id="c0s1" offset="100%" stopColor="#0A192F" />
          </radialGradient>
          <radialGradient id="childGrad1" cx="40%" cy="40%" r="75%">
            <stop id="c1s0" offset="0%" stopColor="#C6FFD9" />
            <stop id="c1s1" offset="100%" stopColor="#145A32" />
          </radialGradient>
          <radialGradient id="childGrad2" cx="30%" cy="30%" r="85%">
            <stop id="c2s0" offset="0%" stopColor="#FFB3C9" />
            <stop id="c2s1" offset="100%" stopColor="#7B1F3A" />
          </radialGradient>
          <radialGradient id="childGrad3" cx="35%" cy="35%" r="80%">
            <stop id="c3s0" offset="0%" stopColor="#E0D1FF" />
            <stop id="c3s1" offset="100%" stopColor="#311B4F" />
          </radialGradient>
          <radialGradient id="childGrad4" cx="40%" cy="40%" r="75%">
            <stop id="c4s0" offset="0%" stopColor="#FFF5B3" />
            <stop id="c4s1" offset="100%" stopColor="#4B3800" />
          </radialGradient>
        </defs>
        <g id="particles" ref={particlesGroupRef}></g>
        <g id="ripples"></g>
        <path 
          id="parentOrb" 
          ref={parentOrbRef} 
          fill="url(#parentGrad)" 
          opacity="0.95" 
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const px = vw / 2;
            const py = vh * 0.3;
            handleOrbClick(px, py, 0);
          }}
        />
        <g id="children" ref={childrenGroupRef}></g>
      </svg>
    </Box>
  );
};

export default AnimatedOrbHeroBG;
