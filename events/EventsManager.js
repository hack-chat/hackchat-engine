import Session from './Session.js';
import Captcha from './Captcha.js';
import Chat from './Chat.js';
import Info from './Info.js';
import Emote from './Emote.js';
import Invite from './Invite.js';
import OnlineSet from './OnlineSet.js';
import UserJoin from './UserJoin.js';
import UserLeave from './UserLeave.js';
import UpdateUser from './UpdateUser.js';
import Warning from './Warning.js';
import Whisper from './Whisper.js';
import PublicChannels from './PublicChannels.js';
import HackAttempt from './HackAttempt.js';

/**
  * This class routes incoming event data to it's proper handler
  * @private
  */
class EventsManager {
  /**
    * @param {Client} client Main client reference
    */
  constructor(client) {
    this.client = client;

    this.Session = new Session(this.client);
    this.Captcha = new Captcha(this.client);
    this.Chat = new Chat(this.client);
    this.Info = new Info(this.client);
    this.Emote = new Emote(this.client);
    this.Invite = new Invite(this.client);
    this.OnlineSet = new OnlineSet(this.client);
    this.UserJoin = new UserJoin(this.client);
    this.UserLeave = new UserLeave(this.client);
    this.UpdateUser = new UpdateUser(this.client);
    this.Warning = new Warning(this.client);
    this.Whisper = new Whisper(this.client);
    this.PublicChannels = new PublicChannels(this.client);
    this.HackAttempt = new HackAttempt(this.client);
  }
}

export default EventsManager;
