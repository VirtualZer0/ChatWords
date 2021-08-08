/**
 * Basic text message from Twitch or Youtube chat
 */
export class TextMessage {

  /**
   *
   * @param {Number|String} userId - Unique user id
   * @param {String} userName - Displayed user name
   * @param {String} text - Message text
   * @param {String} source - Source of message, "yt" for YouTube, "tw" fro Twitch
   */

  userId: String;
  userName: String;
  text: String;
  source: String;

  constructor(userId: String, userName: String, text: String, source: String) {
    this.userId = userId;
    this.userName = userName;
    this.text = text.trim();
    this.source = source;
  }

}