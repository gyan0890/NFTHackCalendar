import './App.css';
import Calendar from './components/Calendar';
import { useContext, useEffect, useState } from 'react';
import WalletService from './services/wallet';
import { AppContext, AppContextProvider } from './states/appcontext';
import { AppActions } from './states/actions';

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
      <Calendar wallet={walletd} />
    </div>

  );
}

export default App;
