"use client"

import { useEffect, useRef } from "react"

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const C = canvasRef.current
    if (!C) return
    const X = C.getContext("2d")
    if (!X) return

    let W: number, H: number, T = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const IW = () => window.innerWidth
    const IH = () => window.innerHeight

    const resize = () => {
      W = C.width = IW() * DPR
      H = C.height = IH() * DPR
      C.style.width = IW() + "px"
      C.style.height = IH() + "px"
    }
    resize()
    window.addEventListener("resize", resize)

    const AURORAS = [
      { x: .12, y: .18, rx: .58, ry: .42, ang: -.3, spd: .00018, hue: 218, a: .10 },
      { x: .90, y: .75, rx: .52, ry: .40, ang: .5, spd: .00014, hue: 228, a: .08 },
      { x: .50, y: .95, rx: .65, ry: .32, ang: .1, spd: .00020, hue: 205, a: .07 },
      { x: .75, y: .06, rx: .42, ry: .36, ang: -.6, spd: .00016, hue: 242, a: .06 },
      { x: .22, y: .58, rx: .38, ry: .30, ang: .3, spd: .00022, hue: 212, a: .06 },
    ]

    const STARS: any[] = []
    ;[[220, .3], [130, .55], [70, .85]].forEach(([n, baseA], layer) => {
      for (let i = 0; i < n; i++) {
        STARS.push({
          x: Math.random(), y: Math.random(),
          r: .35 + Math.random() * (.6 + layer * .55),
          a: baseA + Math.random() * .35,
          tw: Math.random() * Math.PI * 2,
          ts: .008 + Math.random() * .025,
          layer, hue: 205 + Math.random() * 38
        })
      }
    })

    const NODES: any[] = []
    for (let i = 0; i < 55; i++) {
      NODES.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - .5) * .0007, vy: (Math.random() - .5) * .0006,
        r: 1.1 + Math.random() * 1.9, a: .25 + Math.random() * .5,
        hue: 212 + Math.random() * 28, pulse: Math.random() * Math.PI * 2
      })
    }

    const WAVES = [
      { y: .36, amp: .030, f: 1.7, spd: .58, ph: 0, op: .058, w: 1.3 },
      { y: .50, amp: .024, f: 2.2, spd: .42, ph: 1.5, op: .042, w: 1.0 },
      { y: .63, amp: .032, f: 1.4, spd: .68, ph: 2.9, op: .032, w: .9 },
      { y: .76, amp: .019, f: 3.0, spd: .32, ph: .8, op: .022, w: .7 },
      { y: .88, amp: .014, f: 2.5, spd: .25, ph: 2.0, op: .015, w: .6 },
    ]

    const COMETS: any[] = []
    let lastC = 0

    const spawnComet = () => {
      if (Math.random() < .5) {
        COMETS.push({ x: Math.random() * IW(), y: -15, vx: (Math.random() - .35) * 3.5, vy: 3 + Math.random() * 5, len: 90 + Math.random() * 130, a: .7 + Math.random() * .3, life: 1, hue: 208 + Math.random() * 35 })
      } else {
        COMETS.push({ x: IW() + 15, y: Math.random() * IH() * .5, vx: -(3 + Math.random() * 4), vy: 1 + Math.random() * 2.5, len: 80 + Math.random() * 110, a: .6 + Math.random() * .35, life: 1, hue: 215 + Math.random() * 25 })
      }
    }

    let animId: number

    const loop = () => {
      T += .011
      X.setTransform(1, 0, 0, 1, 0, 0)
      X.clearRect(0, 0, W, H)
      X.scale(DPR, DPR)

      const bg = X.createLinearGradient(0, 0, IW() * .8, IH())
      bg.addColorStop(0, '#050A1A')
      bg.addColorStop(.5, '#080F28')
      bg.addColorStop(1, '#020514')
      X.fillStyle = bg
      X.fillRect(0, 0, IW(), IH())

      // Grid
      X.fillStyle = 'rgba(96,165,250,.012)'
      for (let x = 0; x < IW(); x += 32) {
        for (let y = 0; y < IH(); y += 32) {
          X.beginPath()
          X.arc(x, y, .9, 0, Math.PI * 2)
          X.fill()
        }
      }

      // Auroras
      AURORAS.forEach(a => {
        a.ang += a.spd * 55
        const cx = a.x * IW(), cy = a.y * IH()
        const rx = a.rx * IW(), ry = a.ry * IH()
        const pulse = .5 + .5 * Math.sin(T * .35 + a.hue * .05)
        X.save()
        X.translate(cx, cy)
        X.rotate(a.ang)
        const maxR = Math.max(rx, ry)
        const g = X.createRadialGradient(0, 0, 0, 0, 0, maxR)
        g.addColorStop(0, `hsla(${a.hue + Math.sin(T * .18) * 6},82%,58%,${a.a * (0.65 + 0.35 * pulse)})`)
        g.addColorStop(.45, `hsla(${a.hue + 18},72%,42%,${a.a * .28})`)
        g.addColorStop(1, 'transparent')
        X.scale(rx / maxR, ry / maxR)
        X.beginPath()
        X.arc(0, 0, maxR, 0, Math.PI * 2)
        X.fillStyle = g
        X.fill()
        X.restore()
      })

      // Stars
      STARS.forEach(s => {
        s.tw += s.ts
        const a = s.a * (.55 + .45 * Math.sin(s.tw))
        const spd = (s.layer + 1) * .7
        const px = s.x * IW() + Math.sin(T * .045 * spd + s.y * 8) * spd * .9
        const py = s.y * IH() + Math.cos(T * .038 * spd + s.x * 8) * spd * .6
        X.beginPath()
        X.arc(px, py, s.r, 0, Math.PI * 2)
        X.fillStyle = `hsla(${s.hue},65%,88%,${a})`
        X.fill()
        if (s.layer === 2 && a > .72) {
          X.beginPath()
          X.arc(px, py, s.r * 3.5, 0, Math.PI * 2)
          X.fillStyle = `hsla(${s.hue},80%,75%,.04)`
          X.fill()
        }
      })

      // Pulse
      const pulseVal = .5 + .5 * Math.sin(T * .75)
      const r = Math.min(IW(), IH()) * (.28 + pulseVal * .06)
      const pg = X.createRadialGradient(IW() * .5, IH() * .4, 0, IW() * .5, IH() * .4, r)
      pg.addColorStop(0, `rgba(37,99,235,${.038 + pulseVal * .022})`)
      pg.addColorStop(.5, `rgba(59,130,246,${.012 + pulseVal * .008})`)
      pg.addColorStop(1, 'transparent')
      X.fillStyle = pg
      X.fillRect(0, 0, IW(), IH())

      // Waves
      WAVES.forEach(w => {
        const bY = w.y * IH(), amp = w.amp * IH()
        X.beginPath()
        for (let x = 0; x <= IW(); x += 3) {
          const y = bY + Math.sin((x / IW()) * Math.PI * w.f * 2 + T * w.spd + w.ph) * amp + Math.sin((x / IW()) * Math.PI * w.f * 3.8 + T * w.spd * .6 + w.ph) * amp * .32 + Math.sin((x / IW()) * Math.PI * w.f * .75 + T * w.spd * 1.5 + w.ph) * amp * .18
          x === 0 ? X.moveTo(x, y) : X.lineTo(x, y)
        }
        X.strokeStyle = `rgba(96,165,250,${w.op})`
        X.lineWidth = w.w
        X.stroke()
        X.lineTo(IW(), IH())
        X.lineTo(0, IH())
        X.closePath()
        X.fillStyle = `rgba(37,99,235,${w.op * .28})`
        X.fill()
      })

      // Network
      const LINK = IW() * .13
      NODES.forEach((n, i) => {
        n.x += n.vx + Math.sin(T * .28 + i * .7) * .00007
        n.y += n.vy + Math.cos(T * .22 + i * .5) * .00005
        if (n.x < -.02) n.x = 1.02
        if (n.x > 1.02) n.x = -.02
        if (n.y < -.02) n.y = 1.02
        if (n.y > 1.02) n.y = -.02
        n.pulse += .022
        const px = n.x * IW(), py = n.y * IH()
        for (let j = i + 1; j < NODES.length; j++) {
          const m = NODES[j]
          const dx = (n.x - m.x) * IW(), dy = (n.y - m.y) * IH()
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK) {
            const op = (1 - d / LINK) * .16
            X.beginPath()
            X.moveTo(px, py)
            X.lineTo(m.x * IW(), m.y * IH())
            X.strokeStyle = `rgba(96,165,250,${op})`
            X.lineWidth = .7
            X.stroke()
          }
        }
        const pa = n.a * (.65 + .35 * Math.sin(n.pulse))
        X.beginPath()
        X.arc(px, py, n.r, 0, Math.PI * 2)
        X.fillStyle = `hsla(${n.hue + Math.sin(n.pulse) * 8},78%,68%,${pa})`
        X.fill()
        X.beginPath()
        X.arc(px, py, n.r * 2.8, 0, Math.PI * 2)
        X.fillStyle = `hsla(${n.hue},78%,68%,${pa * .12})`
        X.fill()
      })

      // Comets
      if (T - lastC > 3.5 + Math.random() * 5) { spawnComet(); lastC = T }
      for (let i = COMETS.length - 1; i >= 0; i--) {
        const c = COMETS[i]
        c.x += c.vx; c.y += c.vy; c.life -= .014
        if (c.life <= 0 || c.y > IH() + 20 || c.x < -20) { COMETS.splice(i, 1); continue }
        const spd = Math.sqrt(c.vx * c.vx + c.vy * c.vy)
        const tx = c.x - c.vx * c.len / spd, ty = c.y - c.vy * c.len / spd
        const cg = X.createLinearGradient(c.x, c.y, tx, ty)
        cg.addColorStop(0, `hsla(${c.hue},92%,85%,${c.a * c.life})`)
        cg.addColorStop(.35, `hsla(${c.hue},82%,68%,${c.a * c.life * .38})`)
        cg.addColorStop(1, 'transparent')
        X.beginPath()
        X.moveTo(c.x, c.y)
        X.lineTo(tx, ty)
        X.strokeStyle = cg
        X.lineWidth = 1.8
        X.stroke()
        X.beginPath()
        X.arc(c.x, c.y, 2.2, 0, Math.PI * 2)
        X.fillStyle = `hsla(${c.hue},100%,95%,${c.a * c.life})`
        X.fill()
        X.beginPath()
        X.arc(c.x, c.y, 5, 0, Math.PI * 2)
        X.fillStyle = `hsla(${c.hue},90%,80%,${c.a * c.life * .15})`
        X.fill()
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="cvs"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}
