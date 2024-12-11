import fs from "fs";
import path from "path";
import { AppointmentEvent } from "../events/AppointmentEvent";

class EventStore {
  private eventsFile: string;

  constructor() {
    this.eventsFile = path.join(__dirname, "../../data/events.json");
    this.ensureFileExists();
  }

  private ensureFileExists() {
    if (!fs.existsSync(this.eventsFile)) {
      fs.writeFileSync(this.eventsFile, "[]");
    }
  }

  async saveEvent(event: AppointmentEvent): Promise<void> {
    const events = await this.getAllEvents();
    events.push(event);
    await fs.promises.writeFile(
      this.eventsFile,
      JSON.stringify(events, null, 2)
    );
  }

  async getAllEvents(): Promise<AppointmentEvent[]> {
    const data = await fs.promises.readFile(this.eventsFile, "utf-8");
    return JSON.parse(data);
  }
}

export default new EventStore();
