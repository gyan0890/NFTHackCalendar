import './App.css';
import Calendar from './components/Calendar';
import { useContext, useEffect } from 'react';
import WalletService from './services/wallet';
import { AppContext, AppContextProvider } from './states/appcontext';
import { AppActions } from './states/actions';

function App() {

  const [state, dispatch] = useContext(AppContext);
  useEffect(async () => {
    try {
      const wallet = await WalletService.connectwallet();
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
      <Calendar />
    </div>

  );
}

export default App;
