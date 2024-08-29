import { countryList, currencyFromCountry } from "../assets/data.js";
import { useState } from "react";

const Home = () => {
  const [amount, setAmount] = useState(1);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("INR");
  const [countryFrom, setCountryFrom] = useState(countryList[149]);
  const [countryTo, setCountryTo] = useState(countryList[66]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleSwap = () => {
    let temp = currencyFrom;
    setCurrencyFrom(currencyTo);
    setCurrencyTo(temp);
    //
    temp = countryFrom;
    setCountryFrom(countryTo);
    setCountryTo(temp);
  };

  const handleGetExchange = async (evt) => {
    evt.preventDefault();
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${
          import.meta.env.VITE_API_KEY
        }&currencies=${currencyTo}&base_currency=${currencyFrom}`
      );
      if (!res.ok) {
        setErr({ message: "An Error Occurred" });
        return;
      }
      const result = await res.json();
      setExchangeRate(result?.data?.[currencyTo]);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setErr(error);
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen bg-[#FFF6EA] flex justify-center items-center">
      <div className="w-[450px] lg:w-[600px] p-3 rounded-lg">
        <div className="mx-auto my-6 w-9/12 rounded-lg bg-[#b574fb]">
          <p className="text-white font-extrabold text-3xl p-4 lg:p-6 text-center">
            Currency Converter
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-8 lg:pb-4 my-4 lg:my-10 mx-auto">
          <form
            className="flex flex-col gap-4 lg:gap-8 justify-between"
            onSubmit={handleGetExchange}
          >
            <div className="amountDiv">
              <p className="text-xl lg:text-2xl font-medium">Enter Amount</p>
              <input
                className="p-3 mt-2 border border-purple-600 w-full rounded-lg lg:text-lg"
                type="number"
                defaultValue="1"
                onChange={(evt) => setAmount(evt.target.value)}
                required
              />
            </div>

            <div className="dropdown flex justify-between items-center">
              <div className="from flex flex-col gap-2">
                <p className="text-xl font-semibold text-center">From</p>
                <div className="select-container w-36  flex gap-2 px-2 items-center border border-purple-600 rounded-lg">
                  <img
                    src={`https://flagsapi.com/${countryFrom}/flat/64.png`}
                    alt="flag"
                    className="w-18 h-14"
                  />
                  <select
                    name="from"
                    value={countryFrom}
                    className="dropdown-menu w-full  text-center rounded-lg outline-none cursor-pointer"
                    onChange={(evt) => {
                      const newCountry = evt.target.value;
                      setCountryFrom(newCountry);
                      setCurrencyFrom(currencyFromCountry[newCountry]);
                    }}
                  >
                    {countryList.map((currCode, index) => {
                      return (
                        <option key={currCode} value={currCode}>
                          {currencyFromCountry[currCode]}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <img
                src="./arrow.svg"
                alt=""
                className="w-7 mt-7 cursor-pointer hover:scale-110 transform transition duration-300 ease-in-out"
                onClick={handleSwap}
              />

              <div className="to flex flex-col gap-2">
                <p className="text-xl font-semibold text-center">To</p>
                <div className="select-container w-36  flex gap-2 px-2 items-center border border-purple-600 rounded-lg">
                  <img
                    src={`https://flagsapi.com/${countryTo}/flat/64.png`}
                    alt="flag"
                    className="w-18 h-14"
                  />
                  <select
                    name="to"
                    value={countryTo}
                    className="dropdown-menu w-full text-center rounded-lg outline-none cursor-pointer"
                    onChange={(evt) => {
                      const newCountry = evt.target.value;
                      setCountryTo(newCountry);
                      setCurrencyTo(currencyFromCountry[newCountry]);
                    }}
                  >
                    {countryList.map((currCode, index) => {
                      return (
                        <option key={currCode} value={currCode}>
                          {currencyFromCountry[currCode]}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-center">
              <button
                className="bg-[#b77cf6] rounded-xl p-3 px-5 text-white font-bold  cursor-pointer hover:bg-[#9c46f7] transition duration-300 ease-in-out"
                type="submit"
              >
                {loading ? "Processing..." : "Get Exchange Rate"}
              </button>

              <div className="text-lg font-medium">
                {success
                  ? `${amount} ${currencyFrom} = ${(
                      amount * exchangeRate
                    ).toFixed(2)} ${currencyTo}`
                  : err
                  ? err.message || "An Error Occurred"
                  : ""}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Home;
