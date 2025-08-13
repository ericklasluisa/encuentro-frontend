import React from "react";
import EventCard from "./EventCard";

export default function EventList({ events }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Eventos Actuales</h2>
      <p className="text-sm text-gray-500 mb-4">
        {events.length} eventos disponibles
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.idEvento} {...event} />
        ))}
      </div>
    </div>
  );
}
