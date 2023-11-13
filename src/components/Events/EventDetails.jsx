import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { fetchEvent, deleteEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["events", { eventId: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      console.log("deleted");
      navigate("/events");
    },
  });

  function handleDelete() {
    mutate({ id });
  }

  if (isPending) return <LoadingIndicator />;
  if (isSuccess) return <p>Event Deleted</p>;
  if (error) return <>{JSON.stringify(error)}</>;
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
