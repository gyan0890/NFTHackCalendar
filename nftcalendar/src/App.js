import './App.css';
import Calendar from './components/Calendar';
import { useContext, useEffect } from 'react';
import WalletService from './services/wallet';
import { AppContext, AppContextProvider } from './states/appcontext';
import { AppActions } from './states/actions';
import Tabs from "./components/Tabs";
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
      <Tabs>
        <div label="Transact">
         <Calendar/>
        </div>
        <div label="My NFT">
          After 'while, <em>Crocodile</em>!
        </div>
        <div label="Profile">
          Nothing to see here, this tab is <em>extinct</em>!
        </div>
      </Tabs>
    </div>

  );
}

export default App;
