import {useState, useEffect} from "react";
import lens from "./assets/lens.png";
import loadingGif from "./assets/loading.gif";
import "./App.css";



export default function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);
  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    try{
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({prompt}),
      };
      const res = await fetch("/api/ask", requestOptions);

      if (!res.ok){
        throw new Error("Something went wrong");
      }

      const {message} = await res.json();
      setAnswer(message);
    } catch (err) {
      console.error(err,"err");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            disabled= {loading}
            onChange = {(e) => updatePrompt(e.target.value)}
            onKeyDown = {(e) => sendPrompt(e)}
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything!"
            style={{
              backgroundImage: loading ? `url(${loadingGif})`: `url(${lens})`,
            }}
          />
          <div className="spotlight__answer">
            {answer && <p>{answer}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
