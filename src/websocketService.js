// websocketService.js
class WebSocketService {
    constructor() {
      this.socket = null;
      this.listeners = [];
    }
  
    connect(url) {
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log("Connected to WebSocket server");
  
        // Send initial authentication message
        this.send({
          MessageType: "Authenticate",
          Password: "1617e496-e759-46d2-972a-607e89419f0d",
        });
      };
  
      this.socket.onmessage = (event) => {
        const messageString = event.data;
        try {
          const messageObject = JSON.parse(messageString);
          this.listeners.forEach((listener) => listener(messageObject));
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
  
      this.socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    send(data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      } else {
        console.error("WebSocket is not open. Ready state is:", this.socket.readyState);
      }
    }
  
    addListener(listener) {
      this.listeners.push(listener);
    }
  
    removeListener(listener) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;
  