// StatBox.jsx
export default function StatBox({ number, unit, description, text, link, linkText, imagePath, showGreenCircle }) {
  return (
    <div style={styles.box}>
      <div style={styles.imageContainer}>
        <img 
          src={imagePath} 
          alt="" 
          style={styles.image}
        />
        {/* Boleta verda (només si showGreenCircle és true) */}
        {showGreenCircle && <div style={styles.greenCircle}></div>}
      </div>
      
      <div style={styles.content}>
        <div style={styles.numberContainer}>
          <span style={styles.number}>{number}</span>
          {unit && <span style={styles.unit}> {unit}</span>}
        </div>
        
        <div style={styles.description}>{description}</div>
        
        <p style={styles.text}>{text}</p>
        
        <a href={link} style={styles.link}>
          {linkText}
        </a>
      </div>
    </div>
  );
}

const styles = {
  box: {
    position: 'relative',
    width: '100%',
    maxWidth: '655px',
    background: '#F2F2F2',
    borderRadius: '50px',
    padding: '40px',
    //boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    position: 'absolute',
    top: '-20px',
    right: '40px',
    width: '79px',
    height: '79px',
  },
  image: {
    width: '79px',
    height: '79px',
    opacity: 1,
  },
  greenCircle: {
    position: 'absolute',
    bottom: '-30px',
    right: '-30px',
    width: '68px',
    height: '68px',
    background: 'transparent url("/img/Grupo 46.png") 0% 0% no-repeat',
    backgroundSize: 'contain',
    opacity: 1,
  },
  content: {
    paddingRight: '0px',
  },
  numberContainer: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '10px',
  },
  number: {
    textAlign: 'left',
    font: 'normal normal bold 55px/45px Noto Sans, Arial, sans-serif',
    letterSpacing: '0px',
    color: '#4B4B4B',
    opacity: 1,
  },
  unit: {
    textAlign: 'left',
    font: 'normal normal bold 55px/45px Noto Sans, Arial, sans-serif',
    letterSpacing: '0px',
    color: '#4B4B4B',
    opacity: 1,
  },
  description: {
    textAlign: 'left',
    font: 'normal normal normal 30px/45px Noto Sans, Arial, sans-serif',
    letterSpacing: '0px',
    color: '#4B4B4B',
    marginBottom: '20px',
  },
  text: {
    textAlign: 'left',
    font: 'normal normal normal 16px/22px Noto Sans, Arial, sans-serif',
    letterSpacing: '0px',
    color: '#000000',
    opacity: 1,
    marginBottom: '15px',
  },
  link: {
    textAlign: 'left',
    textDecoration: 'underline',
    font: 'normal normal medium 16px/16px Noto Sans, Arial, sans-serif',
    letterSpacing: '0px',
    color: '#C90030',
    opacity: 1,
    cursor: 'pointer',
  },
};