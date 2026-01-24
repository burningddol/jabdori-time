"use client"


import { getAnswer } from "@/shares/axios";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";


export default  function Home() {
const [answer, setAnswer] = useState<string | null>("");
  
  useEffect(()=>{
    const fetchAnswer = async () => {
    const text =  await getAnswer() as string;
    setAnswer(text);
    }

    fetchAnswer();
  },[])

  

  return (
    <div >
     <ReactMarkdown>{answer}</ReactMarkdown>
     
    </div>
  );
}
