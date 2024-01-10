const Chat = () => {
  return (
    <div className="flex h-screen ">
      <div className=" w-1/3 bg-gray-800">Contacts</div>
      <div className="w-2/3 bg-gray-700">
        <div>Chat</div>
        <input type="text" placeholder="Type Message" className="border" />
        <button className="bg-white-500 p2">
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
  );
};

export default Chat;
