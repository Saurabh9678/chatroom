import './App.css';
import io from "socket.io-client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./Pages/Home page/Home"
import Chat from './Pages/Chat Page/Chat';

//Socket connection
const server = "http://localhost:4000"
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions);


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home socket={socket} />
  },
  {
    path: '/chat',
    element: <Chat/>
  }

])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}


export default App;
