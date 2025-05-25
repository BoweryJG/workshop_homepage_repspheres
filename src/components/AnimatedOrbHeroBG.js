import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useOrbContext } from './OrbContextProvider';

const AnimatedOrbHeroBG = ({ zIndex = 0, sx = {}, style = {}, className = "" }) => {
  const svgRef = useRef(null);
  const parentOrbRef = useRef(null);
  const childrenGroupRef = useRef(null);
  const particlesGroupRef = useRef(null);

  // Refs to store mutable values that don't trigger re-renders
  const orbStatesRef = useRef([]);
  const childOrbsRef = useRef([]);
  const particlesRef = useRef([]);
  const viewportSizeRef = useRef({ vw: 800, vh: 800 });
  const parentCenterBaseRef = useRef({ x: 400, y: 400 });
  const parentCenterRef = useRef({ x: 400, y: 400 });
  const orbScaleRef = useRef(1);
  const lastWheelTimeRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  
  // New refs for enhanced features
  const scrollPositionRef = useRef(0);
  // const titleLetterBoundsRef = useRef([]); // Removed
  // const letterParticlesRef = useRef([]); // Removed
  // const explodedLettersRef = useRef(new Set()); // Removed
  const orbReturnAnimationsRef = useRef([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHeroVisibleRef = useRef(true);
  const dataTransmissionsRef = useRef([]);

  const childCount = 5;
  const parentRadius = 64; // Reduced by 20% from 80
  const childRadius = 23; // Reduced by 20% from 29
  const childPoints = 48;
  const childAmp = 0.5;
  const orbMorphDirections = [];
  const orbMorphSpeeds = [];

  // --- Utility functions ---
  const hslToHex = (h, s, l) => {
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
  };

  const lerpColor = (a, b, t) => {
    const ah = parseInt(a.replace('#', ''), 16), bh = parseInt(b.replace('#', ''), 16);
    const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
    const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1);
  };

  const generateSuperSmoothBlob = (cx, cy, r, points, t, amp = 1, phase = 0) => {
    const pts = [];
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      // Reduced amplitude for more sphere-like shape
      const noise =
        Math.sin(angle * 3 + t * 0.7 + phase) * 1.5 * amp +
        Math.sin(angle * 5 - t * 1.1 + phase) * 0.8 * amp +
        Math.sin(angle * 2 + t * 1.7 + phase) * 0.5 * amp;
      const rad = r + noise;
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
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }
    d += "Z";
    return d;
  };

  const getDynamicColorFamily = (i, now) => {
    const baseHue = (i * 67 + now * 0.018) % 360;
    const hue2 = (baseHue + 40 + 20 * Math.sin(now * 0.0007 + i)) % 360;
    const sat = 80 + 10 * Math.sin(now * 0.0005 + i);
    const light1 = 60 + 10 * Math.cos(now * 0.0004 + i * 2);
    const light2 = 35 + 15 * Math.sin(now * 0.0006 + i * 3);
    return [hslToHex(baseHue, sat, light1), hslToHex(hue2, sat, light2)];
  };
  
  const approach = (current, target, speed) => {
    return current + (target - current) * speed;
  };

  const dampedSpring = (current, target, velocity, stiffness, damping) => {
    const force = (target - current) * stiffness;
    velocity += force;
    velocity *= damping;
    current += velocity;
    return [current, velocity];
  };

  const emitParticles = (x, y, color, count = 3, i = 0, now = 0) => {
    if (!particlesRef.current) particlesRef.current = [];
    for (let j = 0; j < count; j++) {
      let h = (i * 67 + now * 0.018) % 360 + (Math.random() - 0.5) * 24;
      let s = 85 + Math.random() * 10;
      let l = 55 + Math.random() * 20;
      const particleColor = hslToHex(h, s, l);
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.4 + Math.random() * 0.7;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      particlesRef.current.push({
        x, y, vx, vy,
        r: 1.1 + Math.random() * 1.2,
        life: 0.6,
        decay: 0.025 + Math.random() * 0.015,
        color: particleColor,
        opacity: 0.45
      });
    }
  };

  // Generate lightning bolt path between two points
  const generateLightningPath = (x1, y1, x2, y2, segments = 5) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let path = `M${x1.toFixed(2)},${y1.toFixed(2)}`;
    
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      
      // Add perpendicular offset for lightning effect
      const perpX = -dy / distance;
      const perpY = dx / distance;
      const offset = (Math.random() - 0.5) * 15 * Math.sin(t * Math.PI);
      
      const px = x + perpX * offset;
      const py = y + perpY * offset;
      
      path += ` L${px.toFixed(2)},${py.toFixed(2)}`;
    }
    
    path += ` L${x2.toFixed(2)},${y2.toFixed(2)}`;
    return path;
  };

  // Create data transmission effect
  const createDataTransmission = (childIndex, parentX, parentY, childX, childY, color) => {
    if (!dataTransmissionsRef.current) dataTransmissionsRef.current = [];
    
    dataTransmissionsRef.current.push({
      childIndex,
      startX: childX,
      startY: childY,
      endX: parentX,
      endY: parentY,
      progress: 0,
      life: 1,
      color,
      direction: Math.random() > 0.5 ? 1 : -1, // 1 for child to parent, -1 for parent to child
    });
  };

  const animateDataTransmissions = () => {
    const transmissionsGroup = svgRef.current?.querySelector('#dataTransmissions');
    if (!transmissionsGroup) return;
    
    // Clear previous transmissions
    transmissionsGroup.innerHTML = '';
    
    // Update and draw active transmissions
    dataTransmissionsRef.current = dataTransmissionsRef.current.filter(t => t.life > 0);
    
    for (const transmission of dataTransmissionsRef.current) {
      transmission.progress += 0.03;
      transmission.life = 1 - transmission.progress;
      
      if (transmission.life > 0) {
        const t = transmission.direction === 1 ? transmission.progress : 1 - transmission.progress;
        
        // Create lightning path
        const path = generateLightningPath(
          transmission.startX,
          transmission.startY,
          transmission.endX,
          transmission.endY,
          4 + Math.floor(Math.random() * 3)
        );
        
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", path);
        pathEl.setAttribute("fill", "none");
        pathEl.setAttribute("stroke", transmission.color);
        pathEl.setAttribute("stroke-width", (1.5 * transmission.life).toFixed(2));
        pathEl.setAttribute("opacity", (transmission.life * 0.8).toFixed(2));
        pathEl.setAttribute("filter", "url(#glow)");
        
        transmissionsGroup.appendChild(pathEl);
        
        // Add bright spot at current position
        const currentX = transmission.startX + (transmission.endX - transmission.startX) * t;
        const currentY = transmission.startY + (transmission.endY - transmission.startY) * t;
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", currentX.toFixed(2));
        circle.setAttribute("cy", currentY.toFixed(2));
        circle.setAttribute("r", (3 * transmission.life).toFixed(2));
        circle.setAttribute("fill", transmission.color);
        circle.setAttribute("opacity", transmission.life.toFixed(2));
        
        transmissionsGroup.appendChild(circle);
      }
    }
  };

  // Removed emitLetterParticles, checkOrbLetterCollision, updateTitleLetterBounds

  const animateParticles = () => {
    if (!particlesGroupRef.current) return;
    
    // Regular particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    
    // Clear and redraw all particles
    particlesGroupRef.current.innerHTML = '';
    
    // Draw regular particles
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= p.decay;
      p.opacity = Math.max(0, p.life);
      
      const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circ.setAttribute("cx", p.x.toFixed(2));
      circ.setAttribute("cy", p.y.toFixed(2));
      circ.setAttribute("r", (p.r * p.opacity).toFixed(2));
      circ.setAttribute("fill", p.color);
      circ.setAttribute("opacity", (p.opacity * 0.7).toFixed(2));
      particlesGroupRef.current.appendChild(circ);
    }
  };

  // Get the context to update gradient colors
  const { updateGradientColors } = useOrbContext();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // window.explodedLettersSet = explodedLettersRef.current; // Removed

    parentOrbRef.current = svg.querySelector('#parentOrb');
    childrenGroupRef.current = svg.querySelector('#children');
    particlesGroupRef.current = svg.querySelector('#particles');
    
    const makeOrbState = () => ({
      drag: 0, dragTarget: 0, dragV: 0,
      squash: 0, squashTarget: 0, squashV: 0,
      mouseDir: 0, mouseDirTarget: 0, mouseDirV: 0,
      wobble: 0, lastUpdate: performance.now(),
      parallaxOffset: 0, parallaxVelocity: 0,
      isReturning: false, returnProgress: 0,
    });

    orbMorphDirections.length = 0;
    orbMorphSpeeds.length = 0;
    orbMorphDirections.push(Math.PI / 2); 
    orbMorphSpeeds.push(0.012);
    for (let i = 0; i < childCount; i++) {
      const angle = Math.PI / 2 + (i - (childCount - 1) / 2) * (Math.PI / 8) + (Math.random() - 0.5) * (Math.PI / 12);
      orbMorphDirections.push(angle);
      orbMorphSpeeds.push(0.014 + i * 0.004 + Math.random() * 0.003);
    }

    orbStatesRef.current = [makeOrbState()]; // Parent
    childOrbsRef.current = [];
    if (childrenGroupRef.current) {
        childrenGroupRef.current.innerHTML = '';
        for (let i = 0; i < childCount; i++) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", `url(#childGrad${i})`); 
            path.setAttribute("opacity", "0.95");
            childrenGroupRef.current.appendChild(path);
            childOrbsRef.current.push(path);
            orbStatesRef.current.push(makeOrbState());
        }
    }

    const adjustSVGSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      viewportSizeRef.current = { vw, vh };
      
      const maxChildIndex = childCount - 1;
      const maxOrbit = parentRadius + 120 + maxChildIndex * 40;
      const maxReach = maxOrbit + childRadius + 8;
      const minDim = Math.min(vw, vh);
      const scale = minDim / (maxReach * 2);
      
      svg.setAttribute('width', vw.toString());
      svg.setAttribute('height', vh.toString());
      svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
      
      parentCenterBaseRef.current = { x: vw / 2, y: vh * 0.15 }; // Further adjusted Y position
      parentCenterRef.current = { x: vw / 2, y: vh * 0.15 }; // Further adjusted Y position
      orbScaleRef.current = scale;
    };

    adjustSVGSize();
    window.addEventListener('resize', adjustSVGSize);

    // Mouse move handler for cursor effect
    const handleMouseMove = (e) => {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced scroll handling with parallax
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - scrollPositionRef.current;
      scrollPositionRef.current = scrollY;
      
      const heroHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollY / heroHeight, 1);
      
      // Check if hero is visible
      const heroElement = document.querySelector('[data-hero-section]');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        isHeroVisibleRef.current = rect.bottom > 0 && rect.top < window.innerHeight;
      }
      
      // Apply parallax to child orbs
      orbStatesRef.current.forEach((state, i) => {
        if (i === 0) return; // Skip parent orb
        
        const parallaxFactor = 0.3 + (i * 0.1);
        const targetParallax = scrollY * parallaxFactor;
        
        // Check if orb should start returning when scrolling back up
        if (isHeroVisibleRef.current && scrollProgress < 0.5) {
          if (!state.isReturning && state.parallaxOffset > 20) {
            state.isReturning = true;
            state.returnProgress = 0;
          }
        }
        
        if (state.isReturning) {
          state.returnProgress += 0.03;
          const returnSpeed = 0.15 + state.returnProgress * 0.4;
          state.parallaxOffset += (0 - state.parallaxOffset) * returnSpeed;
          
          if (Math.abs(state.parallaxOffset) < 2) {
            state.isReturning = false;
            state.parallaxOffset = 0;
          }
        } else if (scrollProgress > 0.1 && !isHeroVisibleRef.current) {
          state.parallaxOffset += (targetParallax - state.parallaxOffset) * 0.1;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    const handleWheel = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastWheelTimeRef.current);
      lastWheelTimeRef.current = now;
      const velocity = Math.max(-80, Math.min(80, e.deltaY / dt * 120));
      
      orbStatesRef.current.forEach((state, i) => {
        if (orbMorphDirections[i] !== undefined) {
            const angle = orbMorphDirections[i];
            const randomFactor = 0.5 + Math.random();
            state.dragTarget += (Math.sin(angle) * velocity * 1.8 + Math.cos(angle) * velocity * 0.7) * randomFactor;
        }
      });
      e.preventDefault();
    };
    
    const eventTarget = svg;
    eventTarget.addEventListener('wheel', handleWheel, { passive: false });

    // Removed initial update of title bounds
    // setTimeout(updateTitleLetterBounds, 100); 

    const animate = () => {
      if (!svgRef.current || !parentOrbRef.current || !childrenGroupRef.current || !particlesGroupRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = performance.now();
      
      // Update gradient colors in context for navbar orb
      const baseHue = (now * 0.01) % 360;
      const startHue = baseHue;
      const endHue = (baseHue + 60 * Math.sin(now * 0.00015 + Math.PI * 0.5)) % 360;
      const startColor = hslToHex(startHue, 80, 60);
      const endColor = hslToHex(endHue, 80, 60);
      updateGradientColors({ start: startColor, end: endColor });
      
      const parentStops = [
        { id: "p0", phase: 0 }, { id: "p1", phase: Math.PI * 0.5 },
        { id: "p2", phase: Math.PI }, { id: "p3", phase: Math.PI * 1.5 }
      ];
      for (let i = 0; i < parentStops.length; i++) {
        const stop = parentStops[i];
        const hue = (baseHue + 60 * Math.sin(now * 0.00015 + stop.phase)) % 360;
        const sat = 80 + 10 * Math.sin(now * 0.0002 + stop.phase);
        const light = 60 + 10 * Math.cos(now * 0.00018 + stop.phase);
        const stopEl = svgRef.current.querySelector(`#${stop.id}`);
        if (stopEl) stopEl.setAttribute("stop-color", hslToHex(hue, sat, light));
      }

      for (let i = 0; i < orbStatesRef.current.length; i++) {
        const state = orbStatesRef.current[i];
        if (!state || orbMorphSpeeds[i] === undefined) continue;
        const spring = 0.045 * (1 + orbMorphSpeeds[i]);
        const damping = 0.90 - orbMorphSpeeds[i] * 0.33;
        [state.drag, state.dragV] = dampedSpring(state.drag, state.dragTarget, state.dragV, spring, damping);
        if (Math.abs(state.dragTarget) < 0.1 && Math.abs(state.drag) > 0.1) {
          state.wobble += 0.04 + orbMorphSpeeds[i] * 0.9;
          state.drag += Math.sin(state.wobble) * Math.max(0, Math.abs(state.drag) * 0.13 * (1 + orbMorphSpeeds[i]));
        } else if (Math.abs(state.dragTarget) < 0.1) {
          state.wobble = 0;
        }
        state.dragTarget = approach(state.dragTarget, 0, 0.018 + orbMorphSpeeds[i] * 0.6);
      }
      
      const parentState = orbStatesRef.current[0];
      if (parentState && orbMorphDirections[0] !== undefined) {
        const parentMorphT = now * 0.0004;
        const parentDrag = parentState.drag;
        const parentAngle = orbMorphDirections[0];
        const parentDx = Math.cos(parentAngle) * parentDrag;
        const parentDy = Math.sin(parentAngle) * parentDrag;
        const scale = orbScaleRef.current || 1;
        
        const { vw, vh } = viewportSizeRef.current;
        // Add cursor effect to parent orb position
        const mouseX = mousePositionRef.current.x;
        const mouseY = mousePositionRef.current.y;
        const mouseDx = mouseX - parentCenterBaseRef.current.x;
        const mouseDy = mouseY - parentCenterBaseRef.current.y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const maxMouseEffect = 30;
        const mouseEffect = Math.max(0, 1 - mouseDistance / 300) * maxMouseEffect;
        
        const px = parentCenterBaseRef.current.x + 
                   Math.sin(now * 0.00011) * vw * 0.09 + 
                   Math.cos(now * 0.00007) * vw * 0.07 +
                   (mouseDx / mouseDistance || 0) * mouseEffect;
        const py = parentCenterBaseRef.current.y + 
                   Math.cos(now * 0.00009) * vh * 0.08 + 
                   Math.sin(now * 0.00016) * vh * 0.06 +
                   (mouseDy / mouseDistance || 0) * mouseEffect;
        parentCenterRef.current = { x: px, y: py };

        const parentR = (parentRadius + parentDrag * 0.15) * scale;
        const parentAmp = (1 + Math.abs(parentDrag) * 0.008) * scale;
        const parentPath = generateSuperSmoothBlob(px + parentDx * scale, py + parentDy * scale, parentR, 64, parentMorphT, parentAmp);
        if (parentOrbRef.current) parentOrbRef.current.setAttribute('d', parentPath);
      }

      if (childrenGroupRef.current && childOrbsRef.current.length === childCount) {
        for (let i = 0; i < childCount; i++) {
          const state = orbStatesRef.current[i + 1];
          if (!state || orbMorphDirections[i+1] === undefined) continue;

          const fam = getDynamicColorFamily(i, now);
          const tcol = 0.5 + 0.5 * Math.sin(now * 0.0005 + i);
          const childGradStop0 = svgRef.current.querySelector(`#c${i}s0`);
          const childGradStop1 = svgRef.current.querySelector(`#c${i}s1`);
          if (childGradStop0) childGradStop0.setAttribute("stop-color", lerpColor(fam[0], fam[1], tcol));
          if (childGradStop1) childGradStop1.setAttribute("stop-color", lerpColor(fam[1], fam[0], tcol));
          
          const baseAngle = (now * 0.00022 + i * (2 * Math.PI / childCount));
          const { vw, vh } = viewportSizeRef.current;
          const currentParentR = (parentRadius + (orbStatesRef.current[0]?.drag || 0) * 0.15) * (orbScaleRef.current || 1);
          
          const minEdge = Math.min(
            parentCenterRef.current.x, vw - parentCenterRef.current.x,
            parentCenterRef.current.y, vh - parentCenterRef.current.y
          );
          const maxChildOrbit = Math.max(40, minEdge - currentParentR - childRadius * (orbScaleRef.current || 1) - 16);
          const orbitPhase = now * (0.00012 + 0.00007 * i) + i * 1.13;
          const orbitWobble = Math.sin(orbitPhase) * 0.18 + Math.cos(orbitPhase * 0.7) * 0.09;
          const minOrbit = currentParentR + childRadius * (orbScaleRef.current || 1) + 12;
          let rawOrbit = (currentParentR + 60 + (i * 0.71 + 1.4) * maxChildOrbit / childCount) * (0.7 + 0.23 * orbitWobble);
          const orbitRadiusVal = Math.max(rawOrbit, minOrbit);
          
          const ellipseA = orbitRadiusVal * 1.3 * (0.97 + 0.07 * Math.sin(now * 0.00013 + i));
          const ellipseB = orbitRadiusVal * 1.1 * (0.97 + 0.07 * Math.cos(now * 0.00016 + i * 2));
          const angle = baseAngle + Math.sin(now * 0.00009 + i * 1.7) * 0.22;
          
          const dragAngle = orbMorphDirections[i + 1];
          const dx = Math.cos(dragAngle) * state.drag;
          const dy = Math.sin(dragAngle) * state.drag;
          
          // Apply parallax offset
          const parallaxY = state.parallaxOffset * (1 + i * 0.2);
          const parallaxX = state.parallaxOffset * 0.3 * Math.sin(i);
          
          // Add cursor effect to child orbs
          const childMouseDx = mousePositionRef.current.x - (parentCenterRef.current.x + Math.cos(angle) * ellipseA);
          const childMouseDy = mousePositionRef.current.y - (parentCenterRef.current.y + Math.sin(angle) * ellipseB);
          const childMouseDistance = Math.sqrt(childMouseDx * childMouseDx + childMouseDy * childMouseDy);
          const childMouseEffect = Math.max(0, 1 - childMouseDistance / 200) * 20 * (1 - i * 0.1);
          
          const x = parentCenterRef.current.x + 
                    Math.cos(angle) * ellipseA + 
                    dx + parallaxX +
                    (childMouseDx / childMouseDistance || 0) * childMouseEffect;
          const y = parentCenterRef.current.y + 
                    Math.sin(angle) * ellipseB + 
                    dy + parallaxY +
                    (childMouseDy / childMouseDistance || 0) * childMouseEffect;
          
          const scale = orbScaleRef.current || 1;
          const cR = (childRadius + state.drag * 0.08) * scale;
          const currentChildAmp = (childAmp + Math.abs(state.drag) * 0.006) * scale;
          const morphT = now * 0.0005 + i * 10;
          
          // Removed checkOrbLetterCollision(x, y, cR);
          
          const childPath = generateSuperSmoothBlob(x, y, cR, childPoints, morphT, currentChildAmp, i);
          
          const path = childOrbsRef.current[i];
          if (path) {
            const fadeStart = 40, fadeEnd = 340;
            const fade = Math.min(1, Math.max(0, (fadeEnd - Math.abs(state.dragTarget)) / (fadeEnd - fadeStart)));
            
            let reassemblyOffsetY = 0;
            let reassemblyScaleFactor = 1;

            if (state.wasVisible === undefined) state.wasVisible = fade > 0.5;

            if (!state.wasVisible && fade > 0.05 && fade < 0.7) {
              const reassemblyProgress = fade / 0.7;
              reassemblyOffsetY = (1 - reassemblyProgress) * (vh * 0.3);
              reassemblyScaleFactor = 0.5 + reassemblyProgress * 0.5;
            }
            
            const finalX = x;
            const finalY = y + reassemblyOffsetY;
            const finalCR = cR * reassemblyScaleFactor;
            const finalChildAmp = currentChildAmp * reassemblyScaleFactor;

            const reassembledChildPath = generateSuperSmoothBlob(finalX, finalY, finalCR, childPoints, morphT, finalChildAmp, i);
            path.setAttribute("d", reassembledChildPath);

            // Adjust opacity based on parallax and hero visibility
            let parallaxFade = 1;
            if (!isHeroVisibleRef.current && !state.isReturning) {
              parallaxFade = Math.max(0, 1 - (state.parallaxOffset / (viewportSizeRef.current.vh * 0.3)));
            } else if (state.isReturning) {
              parallaxFade = 0.3 + state.returnProgress * 0.7;
            }
            
            const finalOpacity = fade * 0.95 * Math.max(0.2, Math.min(1, parallaxFade));

            if (fade < 0.5 && fade > 0.05 && !state.isReturning) {
              const color = lerpColor(fam[0], fam[1], tcol);
              const emission = Math.ceil((0.5 - fade) * 12);
              emitParticles(finalX, finalY, color, emission, i, now);
              path.setAttribute("opacity", finalOpacity.toFixed(2));
            } else if (state.wasVisible && fade <= 0.05) {
              const color = lerpColor(fam[0], fam[1], tcol);
              emitParticles(finalX, finalY, color, 12, i, now);
              path.setAttribute("opacity", "0");
              state.wasVisible = false;
            } else if (!state.wasVisible && fade > 0.05) {
              const color = lerpColor(fam[0], fam[1], tcol);
              emitParticles(finalX, finalY, color, 9, i, now);
              path.setAttribute("opacity", finalOpacity.toFixed(2));
              state.wasVisible = true;
            } else {
              path.setAttribute("opacity", finalOpacity.toFixed(2));
            }
            
            // Intermittently create data transmissions
            if (Math.random() < 0.002 && fade > 0.8 && isHeroVisibleRef.current) {
              const color = lerpColor(fam[0], fam[1], tcol);
              createDataTransmission(i, parentCenterRef.current.x, parentCenterRef.current.y, finalX, finalY, color);
            }
          }
        }
      }
      animateParticles();
      animateDataTransmissions();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', adjustSVGSize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (eventTarget) {
        eventTarget.removeEventListener('wheel', handleWheel);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [updateGradientColors]); // Include updateGradientColors in dependency array

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        pointerEvents: "none", // Allows interaction with elements underneath
        touchAction: 'none', // For consistency with HTML
        background: 'transparent', // Ensure background is transparent
        ...sx,
      }}
      style={style}
      className={className}
    >
      <svg 
        ref={svgRef} 
        id="orbSVG"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="parentGrad" cx="50%" cy="50%" r="70%">
            <stop id="p0" offset="0%" stopColor="#00E5FF"/>
            <stop id="p1" offset="100%" stopColor="#5B3CFF"/>
            <stop id="p2" offset="50%" stopColor="#00E5FF"/>
            <stop id="p3" offset="75%" stopColor="#5B3CFF"/>
          </radialGradient>
          <radialGradient id="childGrad0" cx="50%" cy="50%" r="70%">
            <stop id="c0s0" offset="0%" stopColor="#B3D8FF"/>
            <stop id="c0s1" offset="100%" stopColor="#0A192F"/>
          </radialGradient>
          <radialGradient id="childGrad1" cx="50%" cy="50%" r="70%">
            <stop id="c1s0" offset="0%" stopColor="#C6FFD9"/>
            <stop id="c1s1" offset="100%" stopColor="#145A32"/>
          </radialGradient>
          <radialGradient id="childGrad2" cx="50%" cy="50%" r="70%">
            <stop id="c2s0" offset="0%" stopColor="#FFB3C9"/>
            <stop id="c2s1" offset="100%" stopColor="#7B1F3A"/>
          </radialGradient>
          <radialGradient id="childGrad3" cx="50%" cy="50%" r="70%">
            <stop id="c3s0" offset="0%" stopColor="#E0D1FF"/>
            <stop id="c3s1" offset="100%" stopColor="#311B4F"/>
          </radialGradient>
          <radialGradient id="childGrad4" cx="50%" cy="50%" r="70%">
            <stop id="c4s0" offset="0%" stopColor="#FFF5B3"/>
            <stop id="c4s1" offset="100%" stopColor="#4B3800"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g id="particles"></g>
        <g id="dataTransmissions"></g>
        <path id="parentOrb" fill="url(#parentGrad)" opacity="0.95"/>
        <g id="children"></g>
      </svg>
    </Box>
  );
};

export default AnimatedOrbHeroBG;
