import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";

import Widget from "../components/Widget";
import Sidebar from "../components/Sidebar";
import { fetchTicket, ticketUpdation } from "../api/tickets";
import { getAllUser, updateUserData } from "../api/user.js";

// css

// TASKS :
/*
Create a common dynamic component for widgets ->  done
// 1. GET API for users : userid
// 2. Create a func getAllUsers() => fetch the api => staore the array of objects in state => userDetails
Pass the userdetails in material table 

// PUT API dor users : userid, updated new data -> change of status 
1/ Grab the curr user using onRowClick
2. STore the details of the user -> open a modal 
3. Modal will show all the curr details -> print all user details in the user modal 
4. Grab the new updated value and store it ina state 
5. Fetch the put api -> userid, updated data-> log the response 
*/

// put logic
/*
1. Grab the curr ticket : ticket id , all the curr data along with it 
2. Store the curr Ticket in a state -> display the curr ticket details in the modal 
3. Grab the new updated values and store in a state
4. Fetch the api with the new updated data 
*/

const columns = [
  { title: "ID", field: "id" },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];
const userColumns = [
  { title: "ID", field: "userId" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  {
    title: "STATUS",
    field: "userStatus",
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING: "PENDING",
    },
  },
];

function Admin() {
  // get api and stor the data
  // const [userDetails, setUserDetails] = useState([]);
  // open and close user modal
  const [userList, setUserList] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketStatusCount, setTicketStatusCount] = useState({});

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);
  const [userModal, setUserModal] = useState(false);
  // store the curr user details and the updated user details
  // const [selectedCurrUser, setSelectedCurrUser] = useState({});
  const [message, setMessage] = useState("");
  const showUserModal = () => setUserModal(true);
  const closeUserModal = () => {
    setUserModal(false);
    setUserDetail({});
  };

  useEffect(() => {
    (async () => {
      fetchUsers("");
      fetchTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then((response) => {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  const fetchUsers = (userId) => {
    getAllUser(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
            setUserDetail(response.data[0]);
            showUserModal();
          } else setUserList(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateTicketCount = (tickets) => {
    // filling this empty object with the ticket counts
    // Segrating the tickets in 4 properties according to the status of the tickets
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };

    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    });

    setTicketStatusCount(Object.assign({}, data));
  };
  // Storing teh curr ticket details in a state
  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      title: ticketDetail.title,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      status: ticketDetail.status,
      ticketPriority: ticketDetail.ticketPriority,
    };
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };
  // 3. grabbing teh new updated data and storing it in a state
  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  //  4. Call the api with the new updated data
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        // closing the modal
        setTicketUpdationModal(false);
        // fetching the tickets again to update the table and the widgets
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  const updateUserDetail = () => {
    const data = {
      userType: userDetail.userTypes,
      userStatus: userDetail.userStatus,
      userName: userDetail.name,
    };
    updateUserData(userDetail.userId, data)
      .then(function (response) {
        if (response.status === 200) {
          setMessage(response.message);
          let idx = userList.findIndex(
            (obj) => obj.userId === userDetail.userId
          );
          userList[idx] = userDetail;
          closeUserModal();
          setMessage("User detail updated successfully");
        }
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else console.log(error);
      });
  };

  const changeUserDetail = (e) => {
    if (e.target.name === "status") userDetail.userStatus = e.target.value;
    else if (e.target.name === "name") userDetail.name = e.target.value;
    else if (e.target.name === "type") userDetail.userTypes = e.target.value;
    setUserDetail(userDetail);
    setUserModal(e.target.value);
  };

  return (
    <div className="bg-light vh-100%">
      <Sidebar />

      {/* Welcome text */}
      <div className="container p-5">
        <h3 className="text-center text-danger">
          Welcome, {localStorage.getItem("name")}!
        </h3>
        <p className="text-muted text-center">
          Take a quick look at your admin stats below
        </p>
      </div>

      <div className="row ms-5 ps-5 mb-5">
        {/*  color, title, icon, ticketCount, pathColor  */}
        <Widget
          color="primary"
          title="OPEN"
          icon="envelope-open"
          ticketCount={ticketStatusCount.open}
          pathColor="darkblue"
        />
        <Widget
          color="warning"
          title="PROGRESS"
          icon="hourglass-split"
          ticketCount={ticketStatusCount.progress}
          pathColor="darkblue"
        />
        <Widget
          color="success"
          title="CLOSED"
          icon="check2-circle"
          ticketCount={ticketStatusCount.closed}
          pathColor="darkblue"
        />
        <Widget
          color="secondary"
          title="BLOCKED"
          icon="slash-circle"
          ticketCount={ticketStatusCount.bloocked}
          pathColor="darkblue"
        />
      </div>
      <div className="text-center">
        <h5 className="text-info">{message}</h5>
      </div>
      <div className="container">
        <MaterialTable
          // 1. grabbing the specific ticket from the row
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKET"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },

            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "ticketRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "ticketRecords"),
              },
            ],
          }}
        />
        <hr />

        <MaterialTable
          onRowClick={(event, rowData) => fetchUsers(rowData.userId)}
          data={userList}
          columns={userColumns}
          options={{
            filtering: true,
            sorting: true,
            exportMenu: [
              {
                label: "Export PDF",
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, "UserRecords"),
              },
              {
                label: "Export CSV",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "userRecords"),
              },
            ],
            headerStyle: {
              backgroundColor: "darkblue",
              color: "#FFF",
            },
            rowStyle: {
              backgroundColor: "#EEE",
            },
          }}
          title="USER RECORDS"
        />
        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details and we will call the api  */}
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-danger">
                    {" "}
                    ID : {selectedCurrTicket.id}{" "}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  {/* If equal labels needed , set height and width for labelSize */}
                  <label className="label input-group-text label-md labelSize">
                    Title
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.title}
                    className="form-control"
                  />
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Reporter
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.reporter}
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Assignee
                  </label>
                  <select className="form-control" name="assignee">
                    <option>Utkarshini</option>
                  </select>
                </div>
                {/* Onchange : grabbing teh new updates values from UI  */}
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={selectedCurrTicket.ticketPriority}
                    className="form-control"
                    name="ticketPriority"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Description
                  </label>
                  <textarea
                    type="text"
                    value={selectedCurrTicket.description}
                    onChange={onTicketUpdate}
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {userModal ? (
          <Modal
            show={userModal}
            onHide={closeUserModal}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={updateUserDetail}>
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-primary lead">
                    User ID: {userDetail.userId}
                  </h5>
                  <hr />
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md ">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={userDetail.name}
                      disabled
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md ">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={userDetail.email}
                      onChange={changeUserDetail}
                      disabled
                    />
                  </div>

                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md ">
                      Type
                    </label>
                    <select
                      className="form-select"
                      name="type"
                      value={userDetail.userTypes}
                      disabled
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ENGINEER">ENGINEER</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md ">
                      Status
                    </label>
                    <select
                      name="status"
                      className="form-select"
                      value={userDetail.userStatus}
                      onChange={changeUserDetail}
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>
                <div className="input-group justify-content-center">
                  <div className="m-1">
                    <Button
                      variant="secondary"
                      onClick={() => closeUserModal()}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="m-1">
                    <Button
                      variant="primary"
                      onClick={() => updateUserDetail()}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        ) : (
          ""
        )}

        <hr />
      </div>
    </div>
  );
}

export default Admin;
