import {TextMessage} from './streamEvents';

export default class TwitchConnect {

  /**
   * Create new chat object for Twitch
   * @param {String} channel - Streamer nickname
   */

  channel: string;
  apikey: string;
  botname: string;
  server: string;

  consoleStyle: string;
  plannedDisconnect: boolean;
  events: {[key: string] : Function};
  webSocket: Nullable<WebSocket> = null;

  constructor (channel: string) {
    this.channel = channel;

    this.apikey = "vtr91vw1dzji7piypq7r13itr6is2i"; // API Key for Twitch API. Not very secret information
    this.botname = "justinfan365";
    this.server = "irc-ws.chat.twitch.tv";

    this.consoleStyle = 'background-color: #6441A4; color: #FFFFFF; border-radius: 100px;padding: 1px 4px;';

    this.plannedDisconnect = false;

    this.events = {
      onMessage: () => {},

      onConnect: () => {},
      onDisconnect: () => {},
      onError: () => {}
    }
  }

  /**
   * Connect to Twitch chat using websockets
   */
  connect () {
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
  onMessage(msg: MessageEvent<string>) {
    // Ignore incorrect messages
    if (msg == null) return;

    // Try to parse message
    let parsed = this._parseMessage(msg.data);

    //Ignore unparsed messages
    if (parsed == null) return;

    // Get PING, send PONG
    if (parsed.command === "PING") {
      this.webSocket?.send("PONG :" + parsed.message);
      return;
    }

    if (parsed.command == "PRIVMSG") {
      this._signal('onMessage', new TextMessage(
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
  onError (msg: Event) {
    this._signal('onError', msg);
    this._log("Error: ");
    console.log(msg);
  }

  /**
   * Called on disconnect from websocket
   */
  onClose () {
    if (this.plannedDisconnect) {
      this._signal('onDisconnect', null);
    }
    else {
      this.connect();
    }

    this._log("Disconnect from websocket");
  }

  /**
   * Called when connection with chat established
   */
  onOpen () {
    if (this.webSocket !== null && this.webSocket.readyState === 1) {
      this._log("Connected to websocket");

      this.webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      this.webSocket.send('NICK ' + this.botname);
      this.webSocket.send('JOIN #' + this.channel.toLowerCase());

      this._signal('onConnect', null);
    }
  }

  /**
   * Close current connection with Twitch chat
   */
  close () {
    this.plannedDisconnect = true;
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  _signal (name: string, data: any) {
    this.events[name](data);
  }

  _log (msg: any) {
    console.log('%cTwitch%c ' + msg, this.consoleStyle, '');
  }

  _parseMessage(rawMessage: string) {
    let parsedMessage : {
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
        let tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        // Parse tags to key-value dictionary
        let tags = rawMessage.slice(0, tagIndex) != null ? rawMessage.slice(0, tagIndex).substr(1).split(";") : [];
        let keyedTags: { [key: string]: string } = {};

        tags.forEach(val => {
          let splitted = val.split('=');
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