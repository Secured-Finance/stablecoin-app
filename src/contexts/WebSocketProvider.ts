import { WebSocketProvider as EthersWebSocketProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

/**
 * WebSocket provider that connects to Filecoin network
 * Used for event-driven architecture to reduce RPC calls
 */
export class WebSocketProvider extends EthersWebSocketProvider {
    private _reconnectAttempts = 0;
    private _maxReconnectAttempts = 5;
    private _reconnectInterval = 3000;
    private _url: string;
    private _networkId: ethers.providers.Networkish;

    /**
     * Create a new WebSocket provider
     * @param url WebSocket URL
     * @param network Network ID or name
     */
    constructor(url: string, network: ethers.providers.Networkish) {
        super(url, network);
        this._url = url;
        this._networkId = network;

        this._setupReconnection();
    }

    /**
     * Set up WebSocket reconnection logic
     */
    private _setupReconnection(): void {
        this._websocket.onclose = () => {
            // eslint-disable-next-line no-console
            console.log(
                'WebSocket connection closed. Attempting to reconnect...'
            );

            if (this._reconnectAttempts < this._maxReconnectAttempts) {
                this._reconnectAttempts++;

                setTimeout(() => {
                    // eslint-disable-next-line no-console
                    console.log(
                        `Reconnection attempt ${this._reconnectAttempts}/${this._maxReconnectAttempts}`
                    );

                    const newProvider = new WebSocketProvider(
                        this._url,
                        this._networkId
                    );

                    this.emit('reconnect', newProvider);
                    newProvider._websocket.onopen = () => {
                        // eslint-disable-next-line no-console
                        console.log('WebSocket reconnected successfully');
                        this._reconnectAttempts = 0;
                    };
                }, this._reconnectInterval * this._reconnectAttempts);
            } else {
                // eslint-disable-next-line no-console
                console.error(
                    `Failed to reconnect after ${this._maxReconnectAttempts} attempts`
                );
                this.emit('reconnectFailed');
            }
        };
    }

    /**
     * Clean up the WebSocket connection
     */
    public cleanUp(): void {
        if (this._websocket) {
            this._websocket.onclose = null;
            this._websocket.close();
        }
    }
}
