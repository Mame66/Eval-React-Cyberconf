import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', textAlign:'center', padding:'2rem'}}>
      <p style={{fontFamily:'var(--font-mono)', fontSize:'6rem', fontWeight:700, color:'var(--border)', lineHeight:1}}>404</p>
      <h1 style={{fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em'}}>Page introuvable</h1>
      <p style={{color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:'0.85rem'}}>Cette page n'existe pas.</p>
      <Link to="/" className="btn btn-primary" style={{marginTop:'0.5rem'}}>← Retour à l'accueil</Link>
    </div>
  );
}
