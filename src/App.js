import {useMoralis} from "react-moralis";
import swal from 'sweetalert';
import React from "react";
function App() {
  const ABI= [{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"}],"name":"playerEntry","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"}],"name":"winnerPicked","type":"event"},{"inputs":[],"name":"enterLottery","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getParticipants","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getminContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pickWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startLottery","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const[par, setPar]=React.useState(0);
  const[bal, setBal]=React.useState(0);
  const[min, setMin]=React.useState(0);
  const[status, setStatus]=React.useState(false);
  const {authenticate, isAuthenticated, isAuthenticating, user, account, logout}=useMoralis();
  const {Moralis} = useMoralis();
  async function login(){
      if(!isAuthenticated){
        await authenticate();
      }
      lotteryStatus();
      minContribution();
  }

  async function exit(){
    await logout();
  }
  async function enterLottery(){
    const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "enterLottery",
      abi: ABI,
      msgValue: await Moralis.Units.ETH(prompt("Enter the amount in ETH:"))
    }
   
    const transaction = await Moralis.executeFunction(sendOptions);
    
    
  }

  async function minContribution(){
    // const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "getminContribution",
      abi: ABI
    }
    const transaction = await Moralis.executeFunction(sendOptions);
    setMin(Moralis.Units.FromWei(transaction._hex));
  }


  async function pickWinner(){
      const sendOptions = {
        contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        functionName: "pickWinner",
        abi: ABI
      }
      const transaction = await Moralis.executeFunction(sendOptions);
      setStatus(false);
  }
   
    

  async function getBalance(){
    const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "getBalance",
      abi: ABI
    }
    const transaction = await Moralis.executeFunction(sendOptions);
    setBal(Moralis.Units.FromWei(transaction._hex));
  }

  async function getParticipants(){
    //const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "getParticipants",
      abi: ABI
    }
    const transaction = await Moralis.executeFunction(sendOptions);
    swal({
      title: `Participants: ${Moralis.Units.FromWei(transaction._hex, 0)}`,
      icon: "info",
  });
  }



  async function startLottery(){
    // const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "startLottery",
      abi: ABI
    }
    const transaction = await Moralis.executeFunction(sendOptions);
    setStatus(true);
  }


  async function lotteryStatus(){
    // const web3 = await Moralis.enableWeb3({ provider: "metamask" });
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "isOpen",
      abi: ABI
    }
    const transaction = await Moralis.executeFunction(sendOptions);
    setStatus(transaction);
  }


return (
  <>
    <div className="card text-center bg2" >

       <div className="card-body bg2" >
       
         {/* {isAuthenticated? <button type="button" className="btn btn-outline-warning" onClick={Update}>Balance: {balances}</button> : null} */}
         {isAuthenticated? <p className="lottery">Lottery : {status? "Running": "Closed"}</p> : <p className="lottery">Lottery</p>}
         {isAuthenticated? <p className=" text-gradient">Account : {user.get("ethAddress")}</p> : <p className=" text-gradient">Account : Not Connected</p>}
         {isAuthenticated? <p className=" text-gradient">{null}</p> : null}
         {isAuthenticated? <p className="min">Minimum Contribution : {min} ETH</p> : null}
         {isAuthenticated? <button className="button-custom" onClick={getParticipants}>INFO</button> : null}
         &nbsp;
         &nbsp;
         {!isAuthenticated? <button type="button" className="btn btn-outline-light button-85" onClick={login}>
           Connect to metamask
         </button> : null}
         &nbsp;
         {isAuthenticated? <button type="button" className="button-33" onClick={enterLottery} >Enter Lottery</button> : null}
         &nbsp;
         {(isAuthenticated && user.get('ethAddress')==="0x846A519f8c6ceF4db5ABa30Fc3c36BE38DA48F06".toLowerCase())? <button type="button" className="btn btn-outline-success" onClick={startLottery}>Start Lottery</button> : null}
         &nbsp;
         {(isAuthenticated && user.get('ethAddress')==="0x846A519f8c6ceF4db5ABa30Fc3c36BE38DA48F06".toLowerCase())? <button type="button" className="btn btn-outline-primary" onClick={pickWinner}>Pick Winner</button> : null}
         &nbsp;
         &nbsp;
        {isAuthenticated?<button type="button" className="button-78" onClick={exit}>Logout</button> : null}
       </div>
       <div className="card-footer text-gradient">Copyright @Abir Dutta</div>
     </div>
  </>
 );
}

export default App;
