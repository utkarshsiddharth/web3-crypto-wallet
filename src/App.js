import React, { useEffect, useState, useCallback } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3"
import { loadContract } from "./utils/loadContract"

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  })
  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState("")
  const [reload, setReload] = useState(false)

  const reloadEffect = useCallback(() => setReload(!reload), [reload])

  const setAccountListener = (provider) => {
    console.log({ provider })
    provider.on("accountsChanged", () => window.location.reload())
    provider.on("chainChanged", () => window.location.reload())

    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload
    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null)
    //   }
    // })
  }

  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have access to window.ethereum & window.web3 - injects a global API into websites
      // this API allows websites to request users, accounts , read data to blockchain, sign messages and transactions
      // let provider = null
      // if (window.ethereum) {
      //   provider = window.ethereum
      //   try {
      //     provider.request({ method: "eth_requestAccounts" })
      //   } catch (err) {
      //     console.log(err)
      //   }
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545")
      // }
      const provider = await detectEthereumProvider()
      if (provider) {
        setAccountListener(provider)
        const contract = await loadContract("Faucet", provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider: provider,
          contract,
          isProviderLoaded: true,
        })
      } else {
        console.log("Please install metamask")
        setWeb3Api((prev) => {
          return { ...prev, isProviderLoaded: true }
        })
      }
    }
    loadProvider()
  }, [])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdraw = async () => {
    const { contract, web3 } = web3Api
    await contract.withdraw(web3.utils.toWei("0.1", "ether"), { from: account })
    reloadEffect()
  }

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api?.web3?.eth?.getAccounts()
      if (accounts) {
        setAccount(accounts[0])
      }
    }
    getAccounts()
  }, [web3Api.web3])

  useEffect(() => {
    // get account balance
    const getBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      if (balance) {
        const ethBalance = await web3.utils.fromWei(balance, "ether")
        setBalance(ethBalance)
      }
    }
    web3Api.contract && getBalance()
  }, [web3Api.web3, reload])
  return (
    <div className="faucet">
      <div className="faucet__container">
        <div className="faucet__balance-view is-size-2">
          Current Balance: <strong>{balance}</strong> ETH.
        </div>
        <span>
          <strong>Account:</strong>
        </span>
        {!web3Api.isProviderLoaded ? (
          <div>Loading the web3...</div>
        ) : (
          <h1>
            {account ? (
              account
            ) : !web3Api.provider ? (
              <>
                <div className={"notification is-warning is-small is-rounded"}>
                  {" "}
                  Wallet is not detected{" "}
                  <a
                    href="https://docs.metamask.io"
                    alt="metamask documentation"
                  >
                    Install Metamask
                  </a>{" "}
                </div>
              </>
            ) : (
              "not connected"
            )}
          </h1>
        )}
        <div className="faucet__btn-container">
          <button
            disabled={!account}
            onClick={addFunds}
            className="button is-primary "
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!account}
            onClick={withdraw}
            className="button is-link"
          >
            Withdraw
          </button>
          {!account?.length && web3Api.isProviderLoaded && web3Api.provider && (
            <button
              onClick={() =>
                web3Api.provider.request({ method: "eth_requestAccounts" })
              }
              className="button is-danger"
            >
              Connect Metamask
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
