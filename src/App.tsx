import './style/index.scss';
import "./style/component/message.scss"
import { useEffect, useState } from 'react';
import { TokenSelector } from './component/TokenSelector';
import LoadingDot from './component/LoadingDot';

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [payingCurrency, setPayingCurrency] = useState<string>('CTC');
  const [receivingCurrency, setReceivingCurrency] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [swapRate, setSwapRate] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [swapMessage, setSwapMessage] = useState<string>('')

  const toggleTokenSelectorOpen = () => setIsTokenSelectorOpen(!isTokenSelectorOpen);

  // Fetch the user's balance from API 1
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-balance');
        const data = await response.json();
        setBalance(data[payingCurrency] || 0); // Assuming the balance is an object with currency keys
      } catch (err: any) {
        throw new Error(`Failed to fetch balance ${err.message}`)
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [payingCurrency]);

  // Fetch the currency values from API 2
  useEffect(() => {
    const fetchCurrencyValues = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-price');
        const data = await response.json();
        setSwapRate(data); // Assuming the response is an object like { 'CTC': '0.4577328', 'USDC': '0.9998875', ... }
      } catch (err: any) {
        throw new Error(`Failed to fetch currency value ${err.message}`)
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyValues();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = parseFloat(e.target.value);
    if (!isNaN(enteredAmount) && enteredAmount >= 0) {
      setAmount(enteredAmount);
    } else {
      setAmount(0);
    }
  };

  const handleCurrencySelect = (currency: string) => {
    if (!payingCurrency) {
      setPayingCurrency(currency);
    } else {
      setReceivingCurrency(currency);
    }

    setIsTokenSelectorOpen(false);
  };

  const calculateAmountReceived = () => {
    if (swapRate[payingCurrency] && swapRate[receivingCurrency]) {
      const totalValue = amount * parseFloat(swapRate[payingCurrency]);
      return totalValue / parseFloat(swapRate[receivingCurrency]);
    }
    return 0;
  };

  const isSwapDisabled = amount > balance || !receivingCurrency || amount <= 0;

  // Handle the swap (API 3)
  const handleSwap = async () => {
    if (!isSwapDisabled) {
      try {
        setLoading(true);
        const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/post-swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payingCurrency,
            receivingCurrency,
            amount,
          }),
        });
        const data = await response.json();
        // Handle the response, e.g., show success or update state
        setSwapMessage(data.message || 'Swap successful!')
      } catch (error) {
        setSwapMessage('Error during swap, please try again')
      } finally {
        setLoading(false);
      }
    }
  };

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
                    <input
                      type="number"
                      placeholder="0"
                      value={amount > 0 ? amount : ''}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <button type="button" className="currency-label" onClick={toggleTokenSelectorOpen}>
                    <div className="token CTC" data-token-size="28"></div>
                    <strong className="name">{payingCurrency}</strong>
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt">
                    <div className="balance">
                      <span>Balance: {balance}</span>
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
                    <input
                      type="number"
                      placeholder="0"
                      value={calculateAmountReceived() > 0 ? calculateAmountReceived().toFixed(2) : 0}
                      readOnly
                    />
                  </div>
                  <button type="button" className="currency-label select" onClick={toggleTokenSelectorOpen}>
                    {receivingCurrency || 'Select token'}
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
                <button
                  type="button"
                  className="normal"
                  disabled={isSwapDisabled}
                  onClick={handleSwap}
                >
                  {loading ? <LoadingDot size="md" displayType="inline" /> : 'Swap'}
                </button>
              </div>
              {swapMessage && (
                <div className='swap-message'>
                  {swapMessage}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector onClose={() => setIsTokenSelectorOpen(false)} onSelect={handleCurrencySelect} />
      )}
    </>
  );
};

export { Main as default };



