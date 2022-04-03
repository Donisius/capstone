import './RecordingButton.css';

export const RecordingButton = ({ isActive }) => {
  return (
    <div className={isActive ? 'button active' : 'button'}>
      <div className='inner'></div>
    </div>
  );
};
