const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? '20px' : size === 'large' ? '40px' : '30px';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div
        className="loading-spinner"
        style={{
          width: sizeClass,
          height: sizeClass,
          border: `3px solid rgba(74, 144, 226, 0.3)`,
          borderTopColor: '#4a90e2',
          borderRadius: '50%',
          animation: 'spin 1s ease-in-out infinite'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;

