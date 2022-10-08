import MaterialTable from '@material-table/core';


const lookup = { true: "Available", false: "Unavailable" };

const columns = [
  { title: "First Name", field: "firstName" },
  { title: "Last Name", field: "lastName" },
  { title: "Birth Year", field: "birthYear", type: "numeric" },
  { title: "Availablity", field: "availability", lookup }
];

const data = [
  { firstName: "Tod", lastName: "Miles", birthYear: 1987, availability: true },
  { firstName: "Jess", lastName: "Smith", birthYear: 2000, availability: false }
];

function Admin() {
    return (
        <div className="bg-primary vh-100  p-5">
           <MaterialTable title="Demo Title" columns={columns} data={data} />
        </div>
    )
}

export default Admin; 