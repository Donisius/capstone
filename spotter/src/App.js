import { useState } from 'react';
import { Tab, Tabs } from 'carbon-components-react';

import { ConstraintsEditor } from './components/ConstraintsEditor/ConstraintsEditor';
import { Player } from './components/Player/Player';
import './App.css';

const App = () => {
  const [constraints, setConstraints] = useState([]);

  return (
    <div className='App'>
      <h1 className='title'>Spotter</h1>
      <Tabs style={{ width: 'auto' }}>
        <Tab id='tracking' label='Track movements'>
          <Player constraints={constraints}></Player>
        </Tab>
        <Tab id='constraints-editor' label='Edit constraints'>
          <ConstraintsEditor
            constraints={constraints}
            setConstraints={setConstraints}
          ></ConstraintsEditor>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
