import { useQueries, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchString, setSearchString] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchString }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchString }),
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(searchElement.current.value);
    setSearchString(searchElement.current.value);
  }

  let content = <p>Please enter a search string to find an event</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="EROROROROOR"
        message={error.info?.message || "Failed to get events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
