/**
 * WebSocket Service for Driver Delivery Requests
 * 
 * This service manages WebSocket connections for real-time delivery requests.
 * I don't know how to implement the server-side WebSocket endpoints. 
 * Chukwufunaya. You are to implement the server-side WebSocket endpoints.
 */

export interface DeliveryRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  packageType: string;
  packageDetails?: string;
  estimatedDistance: number;
  estimatedDuration: number;
  deliveryFee: number;
  createdAt: string;
}

export interface WebSocketMessage {
  type: 'delivery_request' | 'request_cancelled' | 'connection_status' | 'error';
  data: any;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (connected: boolean) => void;
type ErrorHandler = (error: any) => void;

class DeliveryWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private reconnectTimer: number | null = null;
  private messageHandlers: MessageHandler[] = [];
  private connectionHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private driverId: string | null = null;

  /**
   * BACKEND INTEGRATION POINT 1: WebSocket URL
   * 
   * Update this URL with your actual WebSocket endpoint.
   * The endpoint should accept driver ID as a path parameter or query string.
   * 
   * Example formats:
   * - ws://your-api.com/ws/driver/{driverId}
   * - ws://your-api.com/ws/driver?id={driverId}
   * - wss://your-api.com/ws/driver/{driverId} (for production with SSL)
   */
  private getWebSocketUrl(driverId: string): string {
    // TODO: Replace with your actual WebSocket URL
    return `ws://10.10.30.42:8001/ws/driver/${driverId}`;
  }

  /**
   * Connect to WebSocket server
   * 
   * @param driverId - The driver's unique identifier
   * @param authToken - Optional authentication token
   */
  connect(driverId: string, authToken?: string): void {
    this.driverId = driverId;
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      const url = this.getWebSocketUrl(driverId);
      console.log('Connecting to WebSocket:', url);
      
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);

        /**
         * BACKEND INTEGRATION POINT 2: Authentication
         * 
         * If your backend requires authentication after connection,
         * send the auth token here.
         */
        if (authToken) {
          this.send({
            type: 'authenticate',
            data: { token: authToken },
          });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);
          
          /**
           * BACKEND INTEGRATION POINT 3: Message Format
           * 
           * Ensure your backend sends messages in this format:
           * {
           *   type: 'delivery_request' | 'request_cancelled' | 'connection_status' | 'error',
           *   data: { ... }
           * }
           * 
           * For delivery requests, data should match the DeliveryRequest interface.
           */
          this.notifyMessageHandlers(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.notifyErrorHandlers(error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.notifyErrorHandlers(error);
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        this.notifyConnectionHandlers(false);
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyErrorHandlers(error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }

  /**
   * Send a message to the WebSocket server
   */
  private send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  /**
   * BACKEND INTEGRATION POINT 4: Accept Delivery Request
   * 
   * Send acceptance message to backend.
   * Backend should:
   * 1. Mark the delivery as accepted
   * 2. Assign the driver to the delivery
   * 3. Notify the customer
   * 4. Return delivery details
   * 
   * @param requestId - The delivery request ID
   */
  acceptDeliveryRequest(requestId: string): void {
    console.log('📤 Accepting delivery request:', requestId);
    
    this.send({
      type: 'accept_delivery',
      data: {
        requestId,
        driverId: this.driverId,
        acceptedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * BACKEND INTEGRATION POINT 5: Decline Delivery Request
   * 
   * Send decline message to backend.
   * Backend should:
   * 1. Mark the request as declined by this driver
   * 2. Offer to next available driver
   * 3. Log the decline for analytics
   * 
   * @param requestId - The delivery request ID
   * @param reason - Optional reason for declining
   */
  declineDeliveryRequest(requestId: string, reason?: string): void {
    console.log('📤 Declining delivery request:', requestId, reason);
    
    this.send({
      type: 'decline_delivery',
      data: {
        requestId,
        driverId: this.driverId,
        reason,
        declinedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * BACKEND INTEGRATION POINT 6: Update Driver Location
   * 
   * Send driver's current location to backend.
   * This helps with:
   * 1. Matching nearby drivers to delivery requests
   * 2. Real-time tracking for customers
   * 3. Estimated arrival times
   * 
   * @param latitude - Driver's latitude
   * @param longitude - Driver's longitude
   */
  updateDriverLocation(latitude: number, longitude: number): void {
    this.send({
      type: 'update_location',
      data: {
        driverId: this.driverId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * BACKEND INTEGRATION POINT 7: Update Driver Status
   * 
   * Update driver's availability status.
   * 
   * @param status - 'online' | 'offline' | 'busy'
   */
  updateDriverStatus(status: 'online' | 'offline' | 'busy'): void {
    this.send({
      type: 'update_status',
      data: {
        driverId: this.driverId,
        status,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      if (this.driverId) {
        this.connect(this.driverId);
      }
    }, delay);
  }

  /**
   * Register a message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Register a connection status handler
   */
  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Register an error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  /**
   * Notify all connection handlers
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  /**
   * Notify all error handlers
   */
  private notifyErrorHandlers(error: any): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (error) {
        console.error('Error in error handler:', error);
      }
    });
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const deliveryWebSocket = new DeliveryWebSocketService();
