import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  //   e.preventDefault();

  //   if (!message) return;
  //   setIsTyping(true);
  //   scrollTo(0, 1e10);

  //   let msgs = chats;
  //   msgs.push({ role: "user", content: message });
  //   setChats(msgs);

  //   setMessage("");

  //   fetch("http://localhost:8000/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       chats,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       msgs.push(data.output);
  //       setChats(msgs);
  //       setIsTyping(false);
  //       scrollTo(0, 1e10);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const [initialEmail, setInitialEmail] = useState("");
  const [responseEmail, setResponseEmail] = useState("");
  const [initialText, setInitialText] = useState("");
  const [responseText, setResponseText] = useState("");

  useEffect(() => { 
    const generateWelcomeMessage = async() => {
      fetch("http://localhost:8000/general", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "prompt": "Say something funny about real estate"
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.output);
          setMessage(data.output);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    generateWelcomeMessage();

  },[])

  const generateResponse = async() => {
    fetch("http://localhost:8000/answerEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "email": initialEmail,
          "maxCharacters": 1000,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.output);
        setResponseEmail(data.output);
      })
      .catch((error) => {
        console.log(error);
      });
  }

 const corectText = async() => {
    fetch("http://localhost:8000/corectText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "text": initialText,
          "maxCharacters": 1000,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.output);
        setResponseText(data.output);
      })
      .catch((error) => {
        console.log(error);
      });
 }

  return (
    <>
      <h2><center>Chat GPT is here to serve you</center></h2>
      <center><p>{message}</p></center>
      <center><span>*These above are jokes (some of them not so good), please do not feel offended</span></center>
      <br/><br/>
      <center><line>_________________________________________</line></center>
      <h3><center>Build response to existing email</center></h3>
      <center><textarea
          className="email"
          type="text"
          name="message"
          value={initialEmail}
          placeholder="Write here the content of the email received and click on Propose response button..."
          onChange={(e) => setInitialEmail(e.target.value)}
        /></center><br/>
        <center><button type="submit" className="btnGenerate" onClick={() => generateResponse()}>Propose response</button></center><br/><br/>
        <center><div dangerouslySetInnerHTML={{__html: responseEmail}} /></center>
       

      <center><line>_________________________________________</line></center>
      <h3><center>Corect mistakes in the text</center></h3>
      <center><textarea
          className="email"
          type="text"
          name="message"
          value={initialText}
          placeholder="Write here the text you want to be corrected and click on Corect text button..."
          onChange={(e) => setInitialText(e.target.value)}
        /></center><br/>
        <center><button type="submit" className="btnGenerate" onClick={() => corectText()}>Correct text</button></center><br/><br/>
        <center><div dangerouslySetInnerHTML={{__html: responseText}} /></center>
        
    </>
  );
}

export default App;
