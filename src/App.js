import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import { useCallback, useState } from "react";
import { useEffect } from "react";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      const order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  const fetchData = useCallback(() => {
    fetch("./data/data.json")
      .then((res) => res.json())
      .then((data) => setAppointmentList(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container p-5 mt-3 font-thin max-auto">
      <h1 className="text-5xl mb-3 text-center">
        <BiCalendar className="inline-block text-red-400 align-top" />
        All Appointments
      </h1>
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (acc, item) => (Number(item.id) > acc ? Number(item.id) : acc),
          0
        )}
      />
      <Search
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        sortBy={sortBy}
        orderBy={orderBy}
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />
      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(id) =>
              setAppointmentList(
                filteredAppointments.filter(
                  (appointment) => appointment.id !== id
                )
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
