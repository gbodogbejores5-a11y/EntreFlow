"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CanvasBackground } from "@/components/landing/canvas-background"

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Générateur de devis",
    desc: "Créez des devis professionnels en moins de 2 minutes. Export PDF avec votre logo et envoi instantané.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    title: "Gestion de stock",
    desc: "Suivez vos produits en temps réel. Recevez des alertes automatiques avant rupture de stock.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Dashboard intelligent",
    desc: "Visualisez toute votre activité en un coup d'œil. KPIs clairs, accessibles et toujours à jour.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 013 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
    title: "Envoi WhatsApp",
    desc: "Partagez vos devis en un clic via WhatsApp. Vos clients reçoivent un document professionnel immédiatement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Carnet clients",
    desc: "Centralisez toutes vos informations clients. Historique complet de chaque relation commerciale.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Sécurité garantie",
    desc: "Vos données sont chiffrées et protégées. Conformité totale et hébergement sécurisé.",
  },
]

export default function LandingPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el))

    const nav = document.getElementById("nav")
    const onScroll = () => {
      if (nav) {
        nav.style.background = window.scrollY > 30
          ? "rgba(5,10,26,0.95)"
          : "rgba(5,10,26,0.6)"
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => {
      obs.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <CanvasBackground />
      <div className="content" style={{ position: "relative", zIndex: 2 }}>
        <nav id="nav" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 6%", height: 72,
          background: "rgba(5,10,26,0.6)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(59,130,246,0.15)",
          transition: "all .4s ease"
        }}>
          <Link href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg viewBox="0 0 34 34" width="34" height="34" fill="none">
              <defs><linearGradient id="G1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient></defs>
              <path d="M6 24C6 24 11 19 17 21C23 23 28 15 28 10" stroke="url(#G1)" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M6 17C6 17 11 12 17 14C23 16 28 8 28 3" stroke="url(#G1)" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55" />
            </svg>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>
              <span style={{ background: "linear-gradient(90deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Entre</span>
              <span style={{ color: "#fff" }}>Flow</span>
            </div>
          </Link>
          <div className="nav-links" style={{ display: "flex", gap: 48 }}>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: "#8A99C2", textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "#F1F5FF"} onMouseLeave={e => e.currentTarget.style.color = "#8A99C2"}>Fonctionnalités</a>
            <a href="#how" style={{ fontSize: 14, fontWeight: 500, color: "#8A99C2", textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "#F1F5FF"} onMouseLeave={e => e.currentTarget.style.color = "#8A99C2"}>Processus</a>
            <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: "#8A99C2", textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "#F1F5FF"} onMouseLeave={e => e.currentTarget.style.color = "#8A99C2"}>Tarifs</a>
          </div>
          <div className="nav-btns" style={{ display: "flex", gap: 12 }}>
            <Link href="/login"><button className="btn-ghost" style={{ padding: "8px 24px", fontSize: 13 }}>Connexion</button></Link>
            <Link href="/signup"><button className="btn-primary" style={{ padding: "8px 28px", fontSize: 13 }}>Créer un compte</button></Link>
          </div>
        </nav>

        <section className="hero" style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          padding: "120px 5% 80px"
        }}>
          <div className="badge animate-fade-in-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 20px", background: "rgba(59,130,246,.12)",
            border: "1px solid rgba(59,130,246,0.15)", borderRadius: 60,
            fontSize: 12, fontWeight: 500, color: "#60A5FA", marginBottom: 32
          }}>
            <span style={{ width: 7, height: 7, background: "#3B82F6", borderRadius: "50%", boxShadow: "0 0 8px #3B82F6", animation: "blink 2s ease infinite", display: "inline-block" }} />
            La nouvelle référence pour les entrepreneurs
          </div>
          <h1 style={{ fontSize: "clamp(40px,7vw,76px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 24 }}>
            Gérez votre business<br />avec une <span className="gradient-text">fluidité absolue</span>
          </h1>
          <p style={{ fontSize: 18, color: "#8A99C2", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Devis professionnels, gestion clients, suivi de stock — tout en un endroit. Simple, rapide, accessible depuis l&apos;Afrique de l&apos;Ouest.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/signup"><button className="btn-primary">Créer mon compte</button></Link>
            <button className="btn-ghost" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Découvrir la plateforme</button>
          </div>

          <div className="frame" style={{
            maxWidth: 1000, margin: "0 auto", borderRadius: 28,
            border: "1px solid rgba(59,130,246,0.15)", overflow: "hidden",
            background: "rgba(10,16,48,.8)", backdropFilter: "blur(8px)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.7)"
          }}>
            <div style={{ padding: "14px 20px", background: "rgba(5,10,26,.9)", borderBottom: "1px solid rgba(59,130,246,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "6px 16px", fontSize: 11, color: "#8A99C2", textAlign: "center", fontFamily: "monospace" }}>app.entreflow.com / dashboard</div>
            </div>
            <div style={{ display: "flex", height: 380 }}>
              <div style={{ width: 200, background: "rgba(5,10,26,.7)", borderRight: "1px solid rgba(59,130,246,0.15)", padding: "20px 0" }}>
                <div style={{ padding: "0 16px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(59,130,246,0.15)", marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, background: "linear-gradient(90deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EntreFlow</div>
                </div>
                {[
                  { icon: <path d="M3 9L12 3L21 9V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" />, label: "Tableau de bord", active: true },
                  { icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></>, label: "Devis", active: false },
                  { icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>, label: "Stock", active: false },
                  { icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>, label: "Clients", active: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 16px", fontSize: 13, fontWeight: 500,
                    color: item.active ? "#60A5FA" : "#8A99C2", cursor: "pointer",
                    background: item.active ? "linear-gradient(90deg,rgba(59,130,246,.15),transparent)" : "transparent",
                    borderRight: item.active ? "2px solid #3B82F6" : "2px solid transparent"
                  }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">{item.icon}</svg>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Bonjour Kofi 👋</h4>
                    <p style={{ fontSize: 11, color: "#8A99C2", marginTop: 2 }}>Mercredi 27 mai 2026</p>
                  </div>
                  <button style={{ padding: "6px 18px", background: "linear-gradient(105deg,#2563EB,#3B82F6)", border: "none", borderRadius: 30, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Nouveau devis</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
                  {[
                    { v: "24", l: "Devis ce mois", t: "▲ +6", tc: "#10B981" },
                    { v: "38", l: "Clients actifs", t: "▲ +3", tc: "#10B981" },
                    { v: "12", l: "Produits suivis", t: "✓ OK", tc: "#10B981" },
                    { v: "2", l: "Alertes stock", t: "⚠ Urgent", tc: "#F97316" },
                  ].map((kpi, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 16, padding: 12 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>{kpi.v}</div>
                      <div style={{ fontSize: 10, color: "#8A99C2", marginTop: 4 }}>{kpi.l}</div>
                      <div style={{ fontSize: 9, color: kpi.tc, marginTop: 6 }}>{kpi.t}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 80px 80px", fontSize: 10, fontWeight: 600, color: "#8A99C2", padding: "0 6px 10px", borderBottom: "1px solid rgba(59,130,246,0.15)", textTransform: "uppercase" }}>
                  <span>Réf.</span><span>Client</span><span>Montant</span><span>Statut</span>
                </div>
                {[
                  { ref: "#EF-024", client: "Pharmacie Moderne", montant: "185 000 F", statut: "Approuvé", cls: "rgba(16,185,129,.16)", tc: "#10B981" },
                  { ref: "#EF-023", client: "Boutique Chic", montant: "92 500 F", statut: "Envoyé", cls: "rgba(59,130,246,.18)", tc: "#60A5FA" },
                  { ref: "#EF-022", client: "Restaurant Saveurs", montant: "48 000 F", statut: "En cours", cls: "rgba(59,130,246,.18)", tc: "#60A5FA" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 80px 80px", padding: "12px 6px", borderBottom: "1px solid rgba(59,130,246,.08)", fontSize: 12, alignItems: "center" }}>
                    <span style={{ color: "#60A5FA", fontWeight: 600 }}>{row.ref}</span><span>{row.client}</span><span>{row.montant}</span>
                    <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 40, width: "fit-content", fontWeight: 600, background: row.cls, color: row.tc }}>{row.statut}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="trust reveal" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", padding: "32px 5%", borderBottom: "1px solid rgba(59,130,246,0.15)", background: "rgba(5,10,26,.4)" }}>
          {[
            { svg: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, text: "+500 entreprises clientes" },
            { svg: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, text: "Données sécurisées" },
            { svg: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, text: "Support 24/7" },
            { svg: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>, text: "Communauté active" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#8A99C2" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#60A5FA" strokeWidth="1.5">{item.svg}</svg>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="stats reveal" style={{ display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap", padding: "56px 5%", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
          {[
            { n: "500+", l: "Entreprises utilisatrices" },
            { n: "12 000+", l: "Devis générés" },
            { n: "2 min", l: "Pour créer un devis" },
            { n: "100%", l: "Satisfaction client" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, background: "linear-gradient(135deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{stat.n}</div>
              <div style={{ fontSize: 14, color: "#8A99C2", marginTop: 8, fontWeight: 500 }}>{stat.l}</div>
            </div>
          ))}
        </div>

        <section id="features" className="sec" style={{ padding: "96px 5%" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="reveal">
              <div style={{ display: "inline-block", padding: "5px 18px", background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 60, fontSize: 12, fontWeight: 600, color: "#60A5FA", marginBottom: 20 }}>Fonctionnalités</div>
              <h2 className="sec-title" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Tout ce dont vous avez besoin<br />pour prospérer</h2>
              <p style={{ fontSize: 16, color: "#8A99C2", maxWidth: 520 }}>Une suite complète d&apos;outils pensés pour les entrepreneurs africains.</p>
            </div>
            <div className="feat-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 1, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 28, overflow: "hidden", marginTop: 56 }}>
              {features.map((feat, i) => (
                <div key={i} className="feat-card" style={{ background: "rgba(10,16,48,.85)", padding: 32, transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(17,24,61,.95)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,16,48,.85)"; e.currentTarget.style.transform = "none" }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(59,130,246,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#60A5FA" }}>{feat.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feat.title}</div>
                  <div style={{ fontSize: 14, color: "#8A99C2", lineHeight: 1.6 }}>{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" style={{ padding: "96px 5%", background: "linear-gradient(180deg,rgba(5,10,26,.4),rgba(10,16,48,.6))" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <div className="reveal">
              <div style={{ display: "inline-block", padding: "5px 18px", background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 60, fontSize: 12, fontWeight: 600, color: "#60A5FA", marginBottom: 20 }}>Processus simplifié</div>
              <h2 className="sec-title" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Simple comme bonjour</h2>
              <p style={{ fontSize: 16, color: "#8A99C2", maxWidth: 520, margin: "0 auto" }}>De zéro à votre premier devis envoyé en quelques minutes.</p>
            </div>
            <div className="how-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 32, marginTop: 64, position: "relative" }}>
              <div style={{ position: "absolute", top: 40, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg,transparent,#2563EB,#3B82F6,transparent)" }} />
              {[
                { n: "1", t: "Créez votre compte", d: "Inscription gratuite en 30 secondes. Ajoutez votre identité professionnelle." },
                { n: "2", t: "Ajoutez vos produits", d: "Entrez vos produits ou services. Disponibles instantanément pour chaque devis." },
                { n: "3", t: "Créez le devis", d: "Sélectionnez client et produits. Les totaux se calculent automatiquement." },
                { n: "4", t: "Envoyez en 1 clic", d: "PDF généré instantanément. Envoi WhatsApp ou email directement depuis l'app." },
              ].map((step, i) => (
                <div key={i} className="how-step" style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", border: "1px solid rgba(59,130,246,0.15)", background: "rgba(59,130,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#60A5FA", margin: "0 auto 20px" }}>{step.n}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.t}</div>
                  <div style={{ fontSize: 14, color: "#8A99C2", lineHeight: 1.55 }}>{step.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "80px 5% 100px" }}>
          <div className="reveal" style={{ maxWidth: 680, margin: "0 auto", padding: "60px 48px", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 48, background: "rgba(10,16,48,.7)", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle,rgba(59,130,246,.2),transparent 70%)", pointerEvents: "none" }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginBottom: 16 }}>Prêt à transformer votre activité ?</h2>
            <p style={{ fontSize: 16, color: "#8A99C2", marginBottom: 32 }}>Rejoignez les entrepreneurs qui utilisent EntreFlow au quotidien pour gagner du temps et conclure plus de ventes.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="Email professionnel" style={{ padding: "14px 22px", borderRadius: 60, border: "1px solid rgba(59,130,246,0.15)", background: "rgba(5,10,26,.8)", color: "#fff", fontSize: 14, width: 280, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <Link href="/signup"><button className="btn-primary">Créer mon compte</button></Link>
            </div>
            <p style={{ fontSize: 12, marginTop: 24, opacity: .6 }}>Aucune carte bancaire requise · Annulation à tout moment</p>
          </div>
        </section>

        <footer style={{ borderTop: "1px solid rgba(59,130,246,0.15)", padding: "48px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg viewBox="0 0 34 34" width="28" height="28" fill="none">
              <defs><linearGradient id="G2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient></defs>
              <path d="M6 24C6 24 11 19 17 21C23 23 28 15 28 10" stroke="url(#G2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M6 17C6 17 11 12 17 14C23 16 28 8 28 3" stroke="url(#G2)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55" />
            </svg>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, background: "linear-gradient(90deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EntreFlow</div>
          </div>
          <div style={{ display: "flex", gap: 36 }}>
            {["Confidentialité", "Conditions", "Assistance", "Contact"].map((link, i) => (
              <a key={i} href="#" style={{ fontSize: 13, color: "#8A99C2", textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "#60A5FA"} onMouseLeave={e => e.currentTarget.style.color = "#8A99C2"}>{link}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#4A5568" }}>© 2026 EntreFlow — Simplifier la gestion au quotidien</div>
        </footer>
      </div>
    </>
  )
}
