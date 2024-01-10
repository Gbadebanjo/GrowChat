import RegisterLogin from "./Register&Login";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Route() {
    const { username, id} = useContext(UserContext);
    if (username) {
        return <Chat/>
    }
    return (
     <RegisterLogin />
    );
  }