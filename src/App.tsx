import './style/index.scss';
import React, { useEffect, useState } from 'react';
import { TokenSelector } from './component/TokenSelector';

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [paidCurrency, setPaidCurrency] = useState<string>("")
  const [receivingCurrency, setReceivingCurrency] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [swapRate, setSwapRate] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const toggleTokenSelectorOpen = () => setIsTokenSelectorOpen(!isTokenSelectorOpen);


  // Fetching user's balance from API 1
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-balance')
        console.log('response:', response)
        const data = await response.json()
        console.log('data:', data)

        setBalance(data[paidCurrency] || 0)
      } catch (err: any) {
        throw new Error(`Failed to fetch: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [paidCurrency])

  // Fetching the currency values from API 2 
  useEffect(() => {
    const fetchCurrencyVals = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-price')
        console.log('response:', response)
        const data = await response.json()
        console.log('data:', data)

        setSwapRate(data)
      } catch (err: any) {
        throw new Error(`Failed to fetch currency values: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchCurrencyVals()
  }, [])

  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder='0' />
                  </div>
                  <button type="button" className="currency-label" onClick={toggleTokenSelectorOpen}>
                    <div className="token CTC" data-token-size="28"></div>
                    <strong className="name">CTC</strong>
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt">
                  </div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: 10</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={() => { }}>
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder='0' readOnly />
                  </div>
                  <button type="button" className="currency-label select" onClick={toggleTokenSelectorOpen}>
                    Select token
                  </button>
                </div>

                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: 0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal" disabled={true} onClick={() => { }}>
                  Swap
                </button>
              </div>

            </div>
          </div>
        </section>
        <div>test</div>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector onClose={() => setIsTokenSelectorOpen(false)} />
      )}
    </>
  );
}

export { Main as default };
