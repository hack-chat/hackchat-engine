/**
  * Base packet handler class
  * @private
  */
class AbstractHandler {
  /**
    * @param {PacketRouter} PacketRouter Main packet router reference
    */
  constructor(PacketRouter) {
    this.packetRouter = PacketRouter;
  }

  /**
    * Generic packet handler function
    * @param {object} packet Packet data
    * @returns {object}
    */
  static handle(packet) {
    return packet;
  }
}

export default AbstractHandler;
