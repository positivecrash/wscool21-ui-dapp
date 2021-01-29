import { stringToHex } from "@polkadot/util";
import { keyring } from "./api";

export default class Robot {
  constructor(account, api) {
    this.api = api;
    keyring.setSS58Format(api.registry.chainSS58);
    this.account = keyring.addFromUri(account);
    this.address = this.account.address;
    this.state = false;
    this.driver = null;
    this.log = [];
    this._worker = null;
    this._loger = null;
    this._listener = null;
    this._listen();
  }

  destroy() {
    if (this._listener) {
      this._listener();
    }
    if (this._loger) {
      this._loger();
    }
    if (this._worker) {
      clearInterval(this._worker);
    }
  }

  async _listen() {
    this._listener = await this.api.query.system.events(events => {
      events.forEach(record => {
        const { event } = record;
        if (event.section === "launch" && event.method === "NewLaunch") {
          const sender = event.data[0].toString();
          const robot = event.data[1].toString();
          const parameter = event.data[2].toHuman();
          if (this.address === robot) {
            if (parameter) {
              this.run(sender);
            } else {
              this.stop(sender);
            }
          }
        }
      });
    });
  }

  run(driver) {
    if (this.state) {
      throw new Error("currently busy");
    }
    this.state = true;
    this.driver = driver;
    this.log = [
      {
        action: "start",
        driver
      }
    ];
    this._worker = setInterval(() => {
      this.log.push({
        action: "data",
        data: Date.now()
      });
    }, 3000);
  }

  stop(driver) {
    if (!this.state) {
      throw new Error("robot is off");
    } else if (this.driver !== driver) {
      throw new Error("permission denied");
    }
    this.state = false;
    this.driver = null;
    clearInterval(this.worker);
    this.log.push({
      action: "stop"
    });
    this._saveLog(JSON.stringify(this.log));
  }

  async _saveLog(data) {
    const tx = this.api.tx.datalog.record(stringToHex(data));
    await tx.signAndSend(this.account);
  }

  async subscribeLog(cb) {
    this._loger = await this.api.query.datalog.datalog(this.address, r => {
      cb(r.toArray());
    });
    return this._loger;
  }
}
