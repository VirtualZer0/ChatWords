/* eslint-disable */
// Old JS-class, needs rewriting to fully support TypeScript

import {TextMessage} from './streamEvents';

export class TwitchConnect {

  /**
   * Create new chat object for Twitch
   * @param {String} channel - Streamer nickname
   */

  channel = '';
  apikey= 'vtr91vw1dzji7piypq7r13itr6is2i';
  botname = `justinfan${Math.floor(Math.random() * (999 - 111) + 111)}`;
  server = 'irc-ws.chat.twitch.tv';

  consoleStyle = 'background-color: #6441A4; color: #FFFFFF; border-radius: 100px;padding: 1px 4px;';
  plannedDisconnect = false;
  connected = false;

  events: { [key: string]: any } = {
    onMessage: null,
    onConnect: null,
    onDisconnect: null,
    onError: null
  };

  webSocket: Nullable<WebSocket> = null;

  setChannel(channel: string): void {
    this.channel = channel;
  }

  /**
   * Connect to Twitch chat using websockets
   */
  connect (): void {
    this.botname = `justinfan${Math.floor(Math.random() * (999 - 111) + 111)}`;
    if (window.location.protocol.includes('https')) {
      this.webSocket = new WebSocket('wss://' + this.server + ':443/', 'irc');
    }
    else {
      this.webSocket = new WebSocket('ws://' + this.server + ':80/', 'irc');
    }


    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
  }

  /**
   * Calling whem new message received
   * @param {String} msg - Raw message from Twitch
   */
  onMessage(msg: MessageEvent<string>): void {
    // Ignore incorrect messages
    if (msg == null) return;

    // Try to parse message
    const parsed = this.parseMessage(msg.data);

    //Ignore unparsed messages
    if (parsed == null) return;

    // Get PING, send PONG
    if (parsed.command === "PING") {
      this.webSocket?.send("PONG :" + parsed.message);
      return;
    }

    if (parsed.command == "PRIVMSG") {
      this.signal('onMessage', new TextMessage(
        parsed.tags["user-id"] as string,
        parsed.tags["display-name"],
        parsed.message,
        'tw'
      ));
    }
  }

  /**
   * Called on error with websocket
   * @param {String} msg
   */
  onError (msg: Event): void {
    this.signal('onError', msg);
    this.log("Error: ");
    console.log(msg);
  }

  /**
   * Called on disconnect from websocket
   */
  onClose (): void {
    this.connected = false;

    if (this.plannedDisconnect) {
      this.signal('onDisconnect', null);
    }
    else {
      this.connect();
    }

    this.log("Disconnect from websocket");
  }

  /**
   * Called when connection with chat established
   */
  onOpen (): void {
    if (this.webSocket !== null && this.webSocket.readyState === 1) {
      this.log("Connected to websocket");
      this.connected = true;

      this.webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      this.webSocket.send('NICK ' + this.botname);
      this.webSocket.send('JOIN #' + this.channel.toLowerCase());

      this.signal('onConnect', null);
    }
  }

  /**
   * Close current connection with Twitch chat
   */
  close (): void {
    this.plannedDisconnect = true;
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  private signal (name: string, data: any): void {
    if (this.events[name]) {
      this.events[name](data);
    }
  }

  private log (msg: any): void {
    console.log('%cTwitch%c ' + msg, this.consoleStyle, '');
  }

  private parseMessage(rawMessage: string) : any {
    const parsedMessage : {
      message: any,
      tags: { [key: string]: string },
      command: any,
      original: string,
      channel: any,
      username: any
    } = {
        message: null,
        tags: {},
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if(rawMessage[0] === '@') {
        const tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        // Parse tags to key-value dictionary
        const tags = rawMessage.slice(0, tagIndex) != null ? rawMessage.slice(0, tagIndex).substr(1).split(";") : [];
        const keyedTags: { [key: string]: string } = {};

        tags.forEach(val => {
          const splitted = val.split('=');
          keyedTags[splitted[0]] = splitted[1];
        });

        parsedMessage.tags = keyedTags;

        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
    }
    else if (rawMessage.startsWith("PING")) {
        parsedMessage.command = "PING";
        parsedMessage.message = rawMessage.split(":")[1];
    }

    return parsedMessage;
  }
}

const twitch = new TwitchConnect();

export default twitch;