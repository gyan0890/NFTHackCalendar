import './App.css';
import Calendar from './components/Calendar';
import { useContext, useEffect, useState } from 'react';
import WalletService from './services/wallet';
import { AppContext, AppContextProvider } from './states/appcontext';
import { AppActions } from './states/actions';
import Tabs from "./components/Tabs";
import MergeImage from "./components/MergeImage";
import { compact } from 'lodash';

function App() {

  const [state, dispatch] = useContext(AppContext);
  const [walletd, setwallet] = useState(null)
  useEffect(async () => {
    try {
      const wallet = await WalletService.connectwallet();
      setwallet(wallet)
      const object = {
        type: AppActions.SETWALLET,
        payload: wallet[0]
      }
      dispatch(object)
    } catch (error) {
      alert("Something went wrong")
      console.error(error)
    }

  }, []);
  return (
    <div className="App">
      <Tabs>
        <div label="Transact">
          <Calendar wallet={walletd} />
        </div>
        <div label="My NFT">
          After 'while, <em>Crocodile</em>!
        </div>
        <div label="Profile">
          Nothing to see here, this tab is <em>extinct</em>!
        </div>
        <div label="Merge">
          <MergeImage />
        </div>
      </Tabs>
    </div>

  );
}

export default App;
