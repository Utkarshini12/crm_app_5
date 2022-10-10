import MaterialTable from '@material-table/core';
import Sidebar from '../components/Sidebar';


const columns = [
  { title: "First Name", field: "firstName" },
  { title: "Last Name", field: "lastName" },
  { title: "Birth Year", field: "birthYear", type: "numeric" },
  { title: "Availablity", field: "availability" }
];

const data = [
  { firstName: "Tod", lastName: "Miles", birthYear: 1987, availability: true },
  { firstName: "Jess", lastName: "Smith", birthYear: 2000, availability: false }
];

function Admin() {
    return (
        <div className="bg-light vh-100">
          <Sidebar />
           <MaterialTable title="Demo Title" columns={columns} data={data} />
        </div>
    )
}

export default Admin; 