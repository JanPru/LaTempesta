// Topbar.jsx
export default function Topbar() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          {/* Rectangle logo (simulant Rectángulo 15.png) */}
          <div style={styles.logoBox}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              <rect width="38" height="38" fill="#0F6641" rx="2"/>
              <text 
                x="19" 
                y="24" 
                textAnchor="middle" 
                fill="#FFFFFF" 
                fontSize="16" 
                fontWeight="bold"
                fontFamily="Noto Sans, Arial, sans-serif"
              >
                LBC
              </text>
            </svg>
          </div>
          
          {/* Logo text (imatge Libraries Boosting Connectivity.png) */}
          <div style={styles.logoTextImage}>
            <img 
              src="/img/Libraries Boosting Connectivity.png" 
              alt="Libraries Boosting Connectivity"
              style={styles.logoImage}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#impact" style={styles.navLink}>Impact</a>
          <a href="#resources" style={styles.navLink}>Resources</a>
          <a href="#faqs" style={styles.navLink}>FAQs</a>
          
          {/* Explore LBC Map amb icona */}
          <a href="/map" style={styles.navLinkRed}>Explore LBC Map</a>
          <a href="/map" style={styles.arrowButton}>
            <img 
              src="/img/Icon core-arrow-circle-right.png" 
              alt="Arrow"
              style={styles.arrowIcon}
            />
          </a>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#FFFFFF',
    //boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px 51px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '38px',
  },
  logoBox: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextImage: {
    width: '200px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    opacity: 1,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    width: 'auto',
    height: '22px',
    textAlign: 'left',
    font: 'normal normal medium 16px/16px Noto Sans',
    letterSpacing: '0px',
    color: '#000000',
    opacity: 1,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  navLinkRed: {
    width: '129px',
    height: '22px',
    textAlign: 'left',
    textDecoration: 'underline',
    font: 'normal normal medium 16px/16px Noto Sans',
    letterSpacing: '0px',
    color: '#C90030',
    opacity: 1,
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  arrowButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    width: '16px',
    height: '16px',
  },
  arrowIcon: {
    width: '16px',
    height: '16px',
    opacity: 1,
  },
};