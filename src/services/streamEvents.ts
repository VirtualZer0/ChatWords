/**
 * Basic text message from Twitch or Youtube chat
 */
export class TextMessage {

  /**
   *
   * @param {number|string} userId - Unique user id
   * @param {string} userName - Displayed user name
   * @param {string} text - Message text
   * @param {string} source - Source of message, "yt" for YouTube, "tw" fro Twitch
   */

  userId: string;
  userName: string;
  text: string;
  source: string;

  constructor(userId: string, userName: string, text: string, source: string) {
    this.userId = userId;
    this.userName = userName;
    this.text = text.trim();
    this.source = source;
  }

}