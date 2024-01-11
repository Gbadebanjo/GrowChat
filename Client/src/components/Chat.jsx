import {useEffect, useState} from 'react'
export default function Chat()  {
    const [ws, setWs] = useState(null);
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3003");
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    }, []);
    function handleMessage(e) {
        console.log('new message', e);
    }
   
  return (
    <div className="flex h-screen ">
      <div className=" w-1/3 bg-white-100">Contacts</div>
      <div className="flex flex-col w-2/3 bg-blue-300 p-2">
        <div className="flex-grow">Chat</div>
        <div className="flex gap-2  ">
          <input
            type="text"
            placeholder="Type Message"
            className="bg-white flex-grow border rounded p-2"
          />
          <button className="bg-blue-500 p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


