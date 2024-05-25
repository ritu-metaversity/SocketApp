// App.js
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "react-bootstrap/Form";
import { Button, Table } from "react-bootstrap";
import io from "socket.io-client";

const socket = io("http://247idhub.com:4042", {
      transports: ["websocket"],
});
function App() {
  const [lastTradePrice, setLastTradePrice] = useState(null);
  const [exchange, setExchange] = useState("");
  const [instrument, setInstrument] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState({instrument: ""});

  const handleSubmit = (e) => {
    e.preventDefault();
     if (currentSubscription.instrument) {
      socket.emit("unsubscribe", { name: currentSubscription.instrument });
    }
    socket.emit("subscribe", { name: instrument });

    setCurrentSubscription({ instrument });
  };

  useEffect(() => {
    const initSocket = () => {
      socket.connect();
      socket.on("data", (data) => {
        setLastTradePrice(data);
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected.");
      });
    };

    initSocket();
    return () => {
      socket.off("data");
      socket.disconnect();
    };

  }, []);
  return (
    <>
      <Form className="form_data" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          {/* <label>Exchange</label>
          <Form.Control
            type="text"
            placeholder="Exchange"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
          />
          <br /> */}
          <label>Instrument Name</label>
          <Form.Control
            type="text"
            placeholder="Instrument Name"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
      <br />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>LastTradePrice</th>
            <th>Open</th>
            <th>Close</th>
            <th>Low</th>
            <th>High</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{lastTradePrice?.LTP}</td>
            <td>{lastTradePrice?.Open}</td>
            <td>{lastTradePrice?.Prev_Close}</td>
            <td>{lastTradePrice?.Low}</td>
            <td>{lastTradePrice?.High}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default App;
