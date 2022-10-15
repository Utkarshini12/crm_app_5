import { useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { ExportCsv, ExportPdf } from '@material-table/exporters'
import { Modal, Button } from 'react-bootstrap'

import { fetchTicket, ticketUpdation } from '../api/tickets';

import Sidebar from '../components/Sidebar';

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
    title: "STATUS", field: "status",
    lookup: {
      "OPEN": "OPEN",
      "IN_PROGRESS": "IN_PROGRESS",
      "CLOSED": "CLOSED",
      "BLOCKED": "BLOCKED"
    }
  },
];
const userColumns = [
  { title: "ID", field: "id" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  { title: "STATUS", field: "status" },
];

function Admin() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({})

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data)

  const openTicketUpdationModal = () => setTicketUpdationModal(true);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);


  useEffect(() => {
    fetchTickets()
  }, [])



  const fetchTickets = () => {
    fetchTicket().then((response) => {
      setTicketDetails(response.data)
      updateTicketCount(response.data);
    }).catch(function (error) {
      console.log(error);
    })
  }

  const updateTicketCount = (tickets) => {

    // filling this empty object with the ticket counts
    // Segrating the tickets in 4 properties according to the status of the tickets 
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0
    }

    tickets.forEach(x => {
      if (x.status === "OPEN") {
        data.open += 1;
      }
      else if (x.status === "CLOSED") {
        data.closed += 1;
      }
      else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    })

    setTicketStatusCount(Object.assign({}, data))


  }
  // Storing teh curr ticket details in a state
  const editTicket= (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee, 
      description: ticketDetail.description, 
      title: ticketDetail.title, 
      id: ticketDetail.id, 
      reporter: ticketDetail.reporter, 
      status: ticketDetail.status, 
      ticketPriority: ticketDetail.ticketPriority, 
    }
    console.log("selected ticket", ticketDetail);
    setTicketUpdationModal(true)
    setSelectedCurrTicket(ticket)
  }
// 3. grabbing teh new updated data and storing it in a state 
  const onTicketUpdate = (e) => {
    if(e.target.name === "ticketPriority")
    selectedCurrTicket.ticketPriority = e.target.value
    else if(e.target.name === "status") 
    selectedCurrTicket.status = e.target.value
    else if(e.target.name === "description") 
    selectedCurrTicket.description = e.target.value


    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket))

    console.log(selectedCurrTicket);
  }

  //  4. Call the api with the new updated data 
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket).then(function(response) {
      console.log(response);
      // closing the modal 
      setTicketUpdationModal(false)
      // fetching the tickets again to update the table and the widgets 
      fetchTickets();
    }).catch(function (error) {
      console.log(error);
    })

  }


  return (
    <div className="bg-light vh-100%">
      <Sidebar />

      {/* Welcome text */}
      <div className="container p-5">
        <h3 className="text-center text-danger">Welcome, {localStorage.getItem("name")}!</h3>
        <p className="text-muted text-center">Take a quick look at your admin stats below</p>
      </div>
      {/* Widgets starts */}
      <div className="row ms-5 ps-5 mb-5">

        {/* w1 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-primary bg-opacity-25 text-center" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle my-2 fw-bolder text-primary"><i className='bi bi-envelope-open text-primary mx-2'></i>Open</h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-primary mx-4 fw-bolder display-6">
                {ticketStatusCount.open}
              </div>
              <div className="col">
                {/* Size of circular bar */}
                <div style={{ width: 40, height: 40 }}>
                  {/* How to use ? 
                    Import from top
                    value={the count of tickets}
                    buildStyles({}) : a function that accepts obj. Obj takes css styles in key value format. Colors can be accepted in hex, rgpa, and text names
                  */}
                  <CircularProgressbar value={ticketStatusCount.open} styles={buildStyles({
                    pathColor: "darkblue"
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* w2 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-warning bg-opacity-25 text-center" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle my-2 fw-bolder text-warning"><i className='bi bi-hourglass-split text-warning  mx-2'></i>Progress</h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-warning mx-4 fw-bolder display-6">
                {ticketStatusCount.progress}
              </div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.progress} styles={buildStyles({
                    pathColor: "darkgoldenrod"
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* w3 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-success bg-opacity-25 text-center" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle my-2 text-success"><i className='bi bi-check2-circle text-success mx-2'></i>Closed</h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-success mx-4 fw-bolder display-6">
                {ticketStatusCount.closed}
              </div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.closed} styles={buildStyles({
                    pathColor: "darkgreen"
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* w4 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-secondary bg-opacity-25 text-center" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle my-2 text-secondary"><i className='bi bi-slash-circle text-secondary mx-2'></i>Blocked</h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-secondary mx-4 fw-bolder display-6">
                {ticketStatusCount.blocked}
              </div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.blocked} styles={buildStyles({
                    pathColor: "darkgrey"
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Widgets end */}
      <div className="container">
        <MaterialTable
        // 1. grabbing the specific ticket from the row 
        onRowClick={(event, rowData)=> editTicket(rowData) }
          title="TICKET"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff"
            },
            rowStyle: {
              backgroundColor: "#eee"
            },

            exportMenu: [{
              label: 'Export Pdf',
              exportFunc: (cols, data) => ExportPdf(cols, data, 'ticketRecords')
            },
            {
              label: 'Export Csv',
              exportFunc: (cols, data) => ExportCsv(cols, data, 'ticketRecords')
            }]
          }}
        />

        <button onClick={openTicketUpdationModal}>ticket update</button>

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered>
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details and we will call the api  */}
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-danger">User ID : {selectedCurrTicket.id} </h5>
                </div>
                <div className="input-group mb-2">
                  {/* If equal labels needed , set height and width for labelSize */}
                  <label className='label input-group-text label-md labelSize'>Title</label>
                  <input type="text" disabled value={selectedCurrTicket.title} className='form-control' />
                </div>

                <div className="input-group mb-2">
                  <label className='label input-group-text label-md'>Reporter</label>
                  <input type="text" disabled value={selectedCurrTicket.reporter} className='form-control' />
                </div>
                <div className="input-group mb-2">
                  <label className='label input-group-text label-md'>Assignee</label>
                  <select className='form-control' name="assignee">
                    <option>Utkarshini</option>
                  </select>
                </div>
                {/* Onchange : grabbing teh new updates values from UI  */}
                <div className="input-group mb-2">
                  <label className='label input-group-text label-md'>Priority</label>
                  <input type="number" value={selectedCurrTicket.ticketPriority} className='form-control' name="ticketPriority" onChange={onTicketUpdate} />
                </div>
                <div className="input-group mb-2">
                  <label className='label input-group-text label-md'>Status</label>
                  <select className='form-select' name="status" value={selectedCurrTicket.status}  onChange={onTicketUpdate}>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>

                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className='label input-group-text label-md'>Description</label>
                  <textarea type="text" value={selectedCurrTicket.description}  onChange={onTicketUpdate} className=' md-textarea form-control' rows="3" name="description" />
                </div>

                <div className="d-flex justify-content-end">
                  <Button variant='secondary' className="m-1" onClick={() => closeTicketUpdationModal}>Cancel</Button>
                  <Button variant='danger' className="m-1" type="submit">Update</Button>

                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        <hr />
        <MaterialTable
          title="USER DETAILS"
          columns={userColumns}
          // data={data} 
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff"
            },
            rowStyle: {
              backgroundColor: "#eee"
            },
            exportMenu: [{
              label: 'Export Pdf',
              exportFunc: (cols, data) => ExportPdf(cols, data, 'userRecords')
            },
            {
              label: 'Export Csv',
              exportFunc: (cols, data) => ExportCsv(cols, data, 'userRecords')
            }]
          }}
        />
      </div>


    </div>
  )
}

export default Admin; 